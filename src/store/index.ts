import {useAuthStore} from '@/store/modules/user.ts'

export default function useStore() {
    return {
        user: useAuthStore()
    }
}
