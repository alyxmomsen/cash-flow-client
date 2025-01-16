// import process from "process";j

// import dotenv from 'dotenv';
// dotenv.config();

export interface IRegistry {}

export class Registry implements IRegistry {}

export function getServerBaseUrl(mode: boolean = true) {
  // const outside = mode ? process.env.ServerBaseURLOutSide : null;
  // const localUrl = process.env.ServerBaseURLLocal;

  return /* outside || localUrl ||  */ "http://127.0.0.1:3030";
}

export function loggerCreator(
  isOn: boolean,
  titleValue: string = "unnamed log",
) {
  const title = titleValue;

  return (data: string) => {
    if (isOn) {
      console.log(`>>> ${title} >>> ${data}`);
    }
  };
}
