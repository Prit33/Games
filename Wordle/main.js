
// constants for gameState
const GUESSING = "guessing";
const WIN = "win";
const LOSE = "lose";

// five letter words list
const WORD_LIST_URL = "https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt";

const QWERTY = "qwertyuiopasdfghjklzxcvbnm".split("");

class Wordle extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      allWords: null,
      targetWord: "",
      userInput: "",
      prevGuesses: [],
      gameState: GUESSING
    };
    
    // bind methods to this
    this.getWordList = this.getWordList.bind(this);
    this.selectTargetWord = this.selectTargetWord.bind(this);
    this.guessWord = this.guessWord.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKBPress = this.handleKBPress.bind(this);
    this.reset = this.reset.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  
  // get list of 5 letter words from url
  getWordList() {
    $.get(WORD_LIST_URL, (data) => {
      this.setState({ allWords: data.split(/\n/) })
    })
  }
  
  // select a new target word
  selectTargetWord() {
    this.setState({
      targetWord: this.state.allWords[Math.floor(Math.random()*this.state.allWords.length)]
    });
  }
  
  // check the guessed word against the target word
  guessWord() {
    const userInput = this.state.userInput;
    if(userInput.length < 5) { return; }
    if(!this.state.allWords.includes(userInput.toLowerCase())) { return; }
    
    let gameState = this.state.gameState;
    if(this.state.targetWord === userInput.toLowerCase()) {
      gameState = WIN;
    }
    
    if(this.state.prevGuesses.length + 1 >= 6) {
      gameState = LOSE;
    }
    this.setState({
      prevGuesses: [...this.state.prevGuesses, userInput],
      userInput: "",
      gameState: gameState
    })
  }
  
  // handle keys pressed
  handleKeyPress(e) {
    if(this.state.gameState != GUESSING) { return; }
    if(e.keyCode === 8) { //backspace
      this.setState({
        userInput: this.state.userInput.slice(0, -1)
      })
      return;
    }
    
    if(e.keyCode === 13) { //enter
      this.guessWord();
      return;
    }
    
    const newChar = String.fromCharCode(e.keyCode);
    const userInput = this.state.userInput;
    if(!/[^a-z]/i.test(newChar) && userInput.length <= 4) {
      this.setState({ userInput: userInput + newChar });
    }
  }
  
  // handle onscreen keys pressed
  handleKBPress(qwertyIdx) {
    const newChar = QWERTY[qwertyIdx].toUpperCase();
    if(this.state.gameState != GUESSING) { return; }
    const userInput = this.state.userInput;
    if(!/[^a-z]/i.test(newChar) && userInput.length <= 4) {
      this.setState({ userInput: userInput + newChar });
    }
  }
  
  // reset game
  reset() {
    this.setState({
      allWords: null,
      targetWord: "",
      userInput: "",
      prevGuesses: [],
      gameState: GUESSING
    })
  }
  
  render() {
    // check if word list has been obtained
    if(this.state.allWords === null) { this.getWordList(); return; }
    // check if target word has been chosen
    else if(this.state.targetWord === "") { this.selectTargetWord(); return; }
    
    // grid
    let rows = [];
    for(let i = 0; i < 6; i++) {
      rows.push([]);
      for(let j = 0; j < 5; j++) {
        let rowWord;
        let styleDepth = "deep";
        let hint = "";
        // previous guesses
        if(this.state.prevGuesses.length > i) { 
          styleDepth = "shallow";
          rowWord = this.state.prevGuesses[i];
          let letter = rowWord.toLowerCase().split("")[j];
          if(letter === this.state.targetWord.split("")[j]) {
            hint = " green";
          } else if(this.state.targetWord.split("").includes(letter)) {
            hint = " yellow";
          }
        }
        // current guess
        else if(this.state.prevGuesses.length === i) {
          rowWord = this.state.userInput;
          if(j + 1 <= rowWord.length) {
            styleDepth = "shallow";
          }
        }
        // blank
        else { rowWord = ""; }
        
        rows[i].push(
          <div className={`grid-square ${hint} ${styleDepth}`} >
            <span>{rowWord.split("")[j]}</span>
          </div>
        );
      }
    }
    
    // keyboard
    let kbRows = [];
    let row;
    for(let i = 0; i < QWERTY.length; i++) {
      if(i < 10) { // top row
        if(i === 0) { kbRows.push([]); }
        row = 0;
      } else if(i < 19) { // middle row
        if(i === 10) { kbRows.push([]); }
        row = 1;
      } else { // bottom row
        if(i === 19) { kbRows.push([]); }
        row = 2;
      }
      
      const charsGuessed = this.state.prevGuesses.join("").toLowerCase().split("");
      let relevantChar = true;
      let onClick = ()=>this.handleKBPress(i);
      
      // check if key is irrelevant (previously guessed and incorrect)
      if(charsGuessed.includes(QWERTY[i])) {
        const targetChars = this.state.targetWord.toLowerCase().split("");
        if(!targetChars.includes(QWERTY[i])) {
          relevantChar = false;
        }
      }
      
      kbRows[row].push(
        <div
          className={"kb-key" + (relevantChar ? " relevant" : "")}
          onClick={onClick}
        >
          <span>{QWERTY[i]}</span>
        </div>
      )
    }
    
    return (
      <div>
        <div id="app-wrapper">
          {rows.map(row => row.map(gridSquare => gridSquare))}
          <div id="kb-wrapper">
            {kbRows.map((kbRow, index) => {
              return (
                <div className="kb-row" id={`kb-row-${index}`}>
                  {kbRow.map(kbKey => kbKey)}
                </div>
              )
            })}
          </div>
          <button id="reset-btn" className="btn-wide" onClick={this.reset}><p>Reset</p></button>
          
        </div>
        {/*
          <div id="test-inputs">
            <button onClick={this.guessWord}>Submit Guess</button>
            <p>Target Word: {this.state.targetWord}</p>
          </div>
        */}
      </div>
    )
  }
}

ReactDOM.render(<Wordle />, document.getElementById("root"));
