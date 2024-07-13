import {DbResponse} from "./DbResponse";

export class DeleteResponse extends DbResponse {
  affectedRows: number;

  constructor(
    status: string,
    timeStamp: Date,
    message: string,
    affectedRows: number
  ) {
    super(status, timeStamp, message);
    this.affectedRows = affectedRows;
  }
}
