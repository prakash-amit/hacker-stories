import * as React from "react";

const welcome = {
  greeting: "Hey",
  title: "React",
};

function getTitle() {
  return welcome.title;
}

//custom react hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = ( )=> {
  return new Promise( ( resolve )=> setTimeout( 
    resolve( { data : { stories: initialStories} } ) ),
    2000
    );
}

const App = () => {
  console.log(" App renders ");


  const [stories, setStories] = React.useState( [] );

  React.useEffect( ( )=> {
    getAsyncStories().then( result => {
      setStories( result.data.stories);
    })
  },
[]
  );

  const handleRemoveStory = ( item )=> {
    const newStories = stories.filter( ( story )=> item.objectID !== story.objectID );
    setStories(newStories);
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>{welcome.greeting + " " + getTitle()}</h1>

      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />

      {/* render the list */}
      <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  console.log(" List renders ");
  return (
    <ul>
      {
        list.map( ( item )=> (
          <Item 
            key={item.objectID} 
            item={item} 
            onRemoveItem={onRemoveItem}
          />
        ))
      }
    </ul>
  );
};

const Item = ( { item, onRemoveItem } )=> {

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={ ( )=> onRemoveItem(item) } >
          Dismiss
        </button>
      </span>
    </li>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  console.log(" Search renders ");

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

export default App;
