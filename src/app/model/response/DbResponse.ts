export class DbResponse {
  status: string;
  timeStamp: Date;
  message: string;

  constructor(
    status: string,
    timeStamp: Date,
    message: string
  ) {
    this.status = status;
    this.timeStamp = timeStamp;
    this.message = message;
  }
}
