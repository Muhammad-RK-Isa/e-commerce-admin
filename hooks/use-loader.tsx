import { create } from "zustand";

interface useLoaderStore {
    isLoading: boolean;
    onLoad: () => void;
    onStop: () => void;
};

const useLoader = create<useLoaderStore>((set) => ({
    isLoading: false,
    onLoad: () => set({ isLoading: true }),
    onStop: () => set({ isLoading: false })
}));

export default useLoader