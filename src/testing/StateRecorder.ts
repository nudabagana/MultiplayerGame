import GameObject from "../game/GameObject";
import { ACTIONS, GameObjectTypes } from "../network/NetworkTypes";

interface IState {
  tick: number;
  serverTick: number;
  timeMs: number;
  gameObjectState: IGameObject[];
  serverGameObjectState: IGameObject[];
}

interface IGameObject {
    x: number;
    y: number;
    type: GameObjectTypes;
    id: number
}

interface IAction {
  tick: number;
  serverTick: number;
  timeMs: number;
  x: number;
  y: number;
  type: ACTIONS;
}

export default class StateRecorder {
  states: IState[];
  actions: IAction[];
  receivedActions: IAction[];
  recording: boolean;
  fileNote?: string;

  constructor() {
    this.states = [];
    this.actions = [];
    this.receivedActions = [];
    this.recording = false;
  }

  setFileNote = (note: string) => {
    this.fileNote = note;
  }

  clear = () => {
    this.states = [];
    this.actions = [];
    this.receivedActions = [];
  };

  startRecording = () => {
    this.recording = true;
  };

  stopRecording = () => {
    this.recording = false;
  };

  save = () => {
    var a = document.createElement("a");
    var file = new Blob(
      [
        JSON.stringify({
          states: this.states,
          actions: this.actions,
          receivedActions: this.receivedActions,
        }),
      ],
      { type: "text/plain" }
    );
    a.href = URL.createObjectURL(file);
    const date = new Date();
    if ( this.fileNote){
      a.download = `Rec ${this.fileNote} ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}.${date.getMinutes()}.${date.getMilliseconds()}.json`;
    }
    else {
      a.download = `Rec ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}.${date.getMinutes()}.${date.getMilliseconds()}.json`;
    }
    a.click();
  };

  addState = (
    tick: number,
    serverTick: number,
    gameObjectState: GameObject[],
    serverGameObjectState: GameObject[]
  ) => {
    if (this.recording) {
      this.states.push({
        tick,
        serverTick,
        timeMs: new Date().getTime(),
        gameObjectState: gameObjectState.map(obj => ({x:obj.x, y:obj.y, type: obj.type, id: obj.id })),
        serverGameObjectState: serverGameObjectState.map(obj => ({x:obj.x, y:obj.y, type: obj.type, id: obj.id })),
      });
    }
  };

  addAction = (
    tick: number,
    serverTick: number,
    x: number,
    y: number,
    type: ACTIONS
  ) => {
    if (this.recording) {
      this.actions.push({
        tick,
        serverTick,
        timeMs: new Date().getTime(),
        x,
        y,
        type,
      });
    }
  };

  addReceivedAction = (
    tick: number,
    serverTick: number,
    x: number,
    y: number,
    type: ACTIONS
  ) => {
    if (this.recording) {
      this.receivedActions.push({
        tick,
        serverTick,
        timeMs: new Date().getTime(),
        x,
        y,
        type,
      });
    }
  };
}
