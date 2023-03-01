import { makeAutoObservable } from "mobx";

export const pointer = makeAutoObservable({ pressed: false });
