**What is the difference between Component and PureComponent? 
Give an example where it might break my app.**
PureComponent implements its own version of shouldComponentUpdate,
re-rendering the component only when state or props change.
To guess if things've changed it does a shallow comparison. 
This saves resourses wasted on unnecessary re-renders, but also can
break an app if shallow check fails to provide intended results - 
deep changes inside objects that are not detected by a shallow 
comparison or using anonymous functions as props.

**Context + ShouldComponentUpdate might be dangerous. Can think of
why is that?**
Sadly no.

**Describe 3 ways to pass information from a component to its PARENT.**
Can only think of two though - using callbacks provided via props or
using passed down context. 

**Give 2 ways to prevent components from re-rendering.**
1. Use shouldComponentUpdate method 
2. Use memoization and references

**What is a fragment and why do we need it? Give an example where it
might break my app.**
Fragment is used to return multiple elements instead of a single node.
Not aware of its caveats sadly.

**Give 3 examples of the HOC pattern.**
1. redux connect
2. sortable lists
3. withRouter

**what's the difference in handling exceptions in promises, callbacks and
  async...await.**
You go for chained catch in case of promises, you set a try .. catch 
for your await calls and you try .. catch errors locally with 
callbacks

**How many arguments does setState take and why is it async.**
Two arguments, second one is a callback fired upon completion of a 
state modification. Being async setState can batch all the changes
from multiple function call and prevent unnecessary re-renders.

**List the steps needed to migrate a Class to Function Component.**
1. Make render a default function body - we are now mostly a 
glorified render function
2. Convert non-lifecycle methods to standalone functions (useCallback would be handy)
3. Convert state handling to useState atomics
4. Convert prop change handlers to something appropriate using useEffect or useMemo
5. Convert HOC wraps like redux connect, context usage to appropriate hooks
6. Recheck on variable access to see if there are any **this** left - **this** is not the way now

**List a few ways styles can be used with components.**
1. Using global CSS and className
2. Using CSS modules and className
3. Direct styling with style tag using style.objects

**How to render an HTML string coming from the server.**
dangerouslySetInnerHTML is the direct way. One can always try to 
parse and transform HTML string into sane and appropriate 
component tree but this path is full of sorrow and surprises. 
