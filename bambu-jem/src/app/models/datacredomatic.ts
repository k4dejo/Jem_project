export class Datacredomatic {
  constructor(
    public type: string,
    public key_id: string,
    public hash: string,
    public time: string,
    public amount: string,
    public orderid: string,
    public processor_id: string,
    public ccnumber: string,
    public ccexp: string,
    public ccv: string,
    public redirect: string,
  ) {}
}
