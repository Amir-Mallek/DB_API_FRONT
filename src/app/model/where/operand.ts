export class Operand {
  type: string = '';

  name: string | undefined;

  value: any = null;

  op1: Operand | undefined;
  op2: Operand | undefined;
  operator: string | undefined;

}
