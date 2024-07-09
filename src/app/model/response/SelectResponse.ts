import {DbResponse} from "./DbResponse";

export class SelectResponse extends DbResponse {
  data: any[];

  constructor(
    status: string,
    timeStamp: Date,
    message: string,
    data: any[]
  ) {
    super(status, timeStamp, message);
    this.data = data;
  }
}
