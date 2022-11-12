import React from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

import './style.css'

const INTEGER_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand){
  if(operand == null) return 
  const [integer, demical] = operand.split(".")
  if(demical == null) return INTEGER_FORMAT.format(integer)
  return `${INTEGER_FORMAT.format(integer)}.${demical}`

}

export const ACTIONS =  {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOSE_OPERATION: 'chose_operation',
  RESULT: 'result',
  CHANGE_SIGN: 'change_sign'
}

const evaluate = ({currentOperant, prevOperant,operation}) => {
  console.log(currentOperant)
  console.log(prevOperant)
  const prev = parseFloat(prevOperant);
  const current = parseFloat(currentOperant);
  if(isNaN(prev) || isNaN(current)) return ''
  let result;
  switch (operation) {
    case "-":
      result = current-prev
      break;
    case "+":
      result = current+prev
      break;
    case "/":
      result = current/prev
      break;      
    case "*":
      result = current*prev
      break;  
    default:
      break;
  }
  return result.toString()
}

const reduser = (state, {type, payload}) => {
  // if(!state.currentOperant) return state
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      
      if(payload.digit == "0" && state.currentOperant == "0") return state
      if(payload.digit === "." && state.currentOperant == null) return state
      if(payload.digit === "." && state.currentOperant.includes('.')) return state
      else return {
        ...state,
        currentOperant: `${state.currentOperant || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.CHOSE_OPERATION:
      if(state.currentOperant == null && state.prevOperant == null) return state
      if(state.prevOperant == null){
        return{
          ...state, 
          operation: payload.operation,
          prevOperant: state.currentOperant,
          currentOperant: null,
        }
      }
      if(state.currentOperant == null){
        return{
          ...state, 
          operation: payload.operation,
        }
      }
      else{
        return{
          ...state, 
          prevOperant: evaluate(state),
          operation: payload.operation,
          currentOperant: null,
        }
      }
    case ACTIONS.RESULT: 
      if(state.prevOperant == null) return state
      else{
        return {
          ...state,
          operation:null,
          prevOperant: null,
          currentOperant: evaluate(state),
        }
      }
    case ACTIONS.DELETE_DIGIT: 
      if(state.prevOperant == null && state.currentOperant == null) return state
      if(state.currentOperant == null) return state
      else{
        return {
          ...state,
          currentOperant: state.currentOperant.slice(0, -1),
        }
      }
    case ACTIONS.CHANGE_SIGN:
      if(state.currentOperant == null) return state
      return{
        ...state,
        currentOperant: state.currentOperant[0] ==="-" ? state.currentOperant.slice(1) : "-" +  state.currentOperant
      }
    default: return {}
  }
}
function App() {
  
  const [{currentOperant, prevOperant,operation}, dispatch] = React.useReducer(reduser, {})


  // dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit:1}})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previos-operand">{formatOperand(prevOperant)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperant)}</div>
      </div>
      <button onClick={()=> dispatch({type: ACTIONS.CLEAR, payload: ""})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.CHANGE_SIGN, payload: ""})}>+/-</button>
      <button onClick={()=> dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation={'/'}></OperationButton>
      <DigitButton dispatch={dispatch} digit={1}></DigitButton>
      <DigitButton dispatch={dispatch} digit={2}></DigitButton>
      <DigitButton dispatch={dispatch} digit={3}></DigitButton>
      <OperationButton dispatch={dispatch} operation={'*'}></OperationButton>
      <DigitButton dispatch={dispatch} digit={4}></DigitButton>
      <DigitButton dispatch={dispatch} digit={5}></DigitButton>
      <DigitButton dispatch={dispatch} digit={6}></DigitButton>
      <OperationButton dispatch={dispatch} operation={'+'}></OperationButton>
      <DigitButton dispatch={dispatch} digit={7}></DigitButton>
      <DigitButton dispatch={dispatch} digit={8}></DigitButton>
      <DigitButton dispatch={dispatch} digit={9}></DigitButton>
      <OperationButton dispatch={dispatch} operation={'-'}></OperationButton>
      <DigitButton dispatch={dispatch} digit={'.'}></DigitButton>
      <DigitButton dispatch={dispatch} digit={0}></DigitButton>
      <button className="span-2" onClick={()=> dispatch({type:ACTIONS.RESULT})}>=</button>
    </div>
  );
}

export default App;