import { firebase } from '../firebase';
import 'firebase/auth'

export const signUpUser = async ({ name, email, password }) => {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      firebase.auth().currentUser.updateProfile({
        displayName: name,
      })
      return { user }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }


export const loginUser = async ({ email, password }) => {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
      return { user }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }


export const sendEmailWithPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const logoutUser = () => {
  firebase.auth().signOut()
}