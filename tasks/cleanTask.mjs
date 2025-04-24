import { deleteAsync } from 'del';

export function cleanTask() {
    return deleteAsync(['dist']);
}