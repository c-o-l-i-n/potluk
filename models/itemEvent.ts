export enum ItemEventType {
  ADD = 'create',
  CHANGE_NAME = 'change-name',
  BRING = 'bring',
  UNBRING = 'unbring',
  DELETE = 'delete'
}

export default interface ItemEvent {
  type: ItemEventType;
  categoryIndex: number;
  itemId: string;
  user: string;
  name?: string
}