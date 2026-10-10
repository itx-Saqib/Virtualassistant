import * as yup from 'yup'

export const registerSchema = yup.object({
    name:yup.string().min(3,'name must be at least 3 letters').trim().required('name is required'),
    email:yup.string().required('email is required').trim().email(),
    password:yup.string().required('password is required').min(8,'password must be at least 8 letters')

})
export const loginSchema = yup.object({
    email:yup.string().required('email is required').trim().email(),
    password:yup.string().required('password is required').min(8,'password must be at least 8 letters')
})
