import * as React from 'react';
import { classnames, highlightRegex, highlightString } from '../utils/helpers'

class AutoComplete extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: false,
      isVisible: false,
      isEmptySet: false,
      suggestions: [],
    }

    this.searchString = props.value;
    this.lastValid = props.value;
    this.typingTimeout = null;
    this.typeDelay = props.typeDelay || 300;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputKeydown = this.handleInputKeydown.bind(this);
    this.getSomeSuggestions = this.getSomeSuggestions.bind(this);
  }

  handleInputChange(e) {
    this.props.onChange(e.target.value);
  }

  handleInputBlur() {
    this.setState({ isVisible: false });
    if (this.props.locked) {
      if (this.searchString === '') {
        this.confirmValue('');
      } else {
        this.props.onChange(this.lastValid);
        this.searchString = this.lastValid;
      }
    }
  }

  handleInputFocus() {
    this.setState({ isVisible: true });
  }

  handleInputKeydown(e) {
    const { state } = this;
    switch (e.keyCode) {
      case 9: // keyboard tab key
      case 13: // keyboard enter key
        if (state.suggestions.length && state.suggestionIndex < state.suggestions.length) {
          this.confirmValue(state.suggestions[state.suggestionIndex].name);
        } else {
          return;
        }
        break;
      case 38: // keyboard up key
        this.setState({ suggestionIndex: Math.max(state.suggestionIndex - 1, 0) });
        break;
      case 40: // keyboard down key
        this.setState({ suggestionIndex: Math.min(state.suggestionIndex + 1, state.suggestions.length - 1) });
        break;
      default:
        return;
    }

    // we get here only when after we handle known hotkeys, so we cancel the event since we've processed it already
    e.preventDefault();
    e.stopPropagation();
  }

  confirmValue(val) {
    this.searchString = val;
    this.props.onChange(val);
    this.lastValid = val;
    this.setState({ suggestions: [] });
  }

  getSomeSuggestions(value) {
    const { props } = this;

    if (!this.state.isVisible) return;
    if (value === '') {
      this.setState({ suggestions: [], isEmptySet: false });
      this.searchString = value;

    } else {
      if (typeof props.filter === 'function') {
        if (this.searchString === value) return;
        this.searchString = value;
        // we wait till user finishes typing stuff, just a coupla hundreds of milliseconds,
        // this could save us some unnecessary requests
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }

        this.typingTimeout = setTimeout(() => {
          this.setState({ isLoading: true });
          props.filter(value)
            .then((items) => {
              const stateUpdate = { isLoading: false };
              if (this.searchString === value) { // this way we filter obsolete results
                if (items.length) {
                  // lets prepare a highlighted version. normally a filter function should provide us hints
                  // on how to highlight, but i guess we'll have to da it manually upon receiving the results
                  const hlExpr = highlightRegex(value);
                  stateUpdate.isEmptySet = false;
                  stateUpdate.suggestions = items.map((item) => ({
                    ...item,
                    highlighted: highlightString(item.name, [hlExpr]),
                  }));
                } else {
                  stateUpdate.isEmptySet = true;
                  stateUpdate.suggestions = [];
                }

                stateUpdate.suggestionIndex = 0;
              }

              this.setState(stateUpdate);
            })
            .catch(() => {
              this.setState({ isLoading: true, isEmptySet: false });
            });
        }, this.typeDelay);
      }
    }
  }

  handleItemSelected(el) {
    if (el) {
      // we want currently active item to always be on screen if we are navigating using keyboard and the list is long
      el.scrollIntoView?.({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }

  componentDidUpdate(props, state) {
    if (props.value !== this.props.value || state.isVisible !== this.state.isVisible) {
      this.getSomeSuggestions(this.props.value);
    }
  }

  render() {
    const { state, props } = this;
    const handleItemClick = (item) => () => {
      this.confirmValue(item.name);
    }

    return (
      <div className={classnames("field-input-autocomplete", props.className, state.isLoading && 'loading')}>
        <input
          value={props.value}
          onChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeydown}
        />
        {state.isLoading && <div className="loading-spinner"><div /><div /></div>}
        {state.isVisible && state.isEmptySet && <div className="suggestion-items empty">No suggestions.</div>}
        {state.isVisible && state.suggestions.length > 0 && <div className="suggestion-items">
          {state.suggestions.map((item, index) => (
            <span
              className={classnames("suggestion-item", index === state.suggestionIndex && 'active')}
              key={item.name}
              ref={index === state.suggestionIndex ? this.handleItemSelected : null}
              onMouseDown={handleItemClick(item)}>
            {item.highlighted || item.name}
          </span>
          ))}
        </div>}
      </div>
    );
  }
}

export default AutoComplete;
