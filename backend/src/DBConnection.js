import {collection, onSnapshot, getFirestore, addDoc, deleteDoc, 
    doc, query, where, orderBy, serverTimestamp, getDoc
} from "firebase/firestore";

//init service
const db = getFirestore()

function collectUserData() {
    // User collection ref
    const UserRef = collection(db, 'User')

    // User query -> Maybe can pass in a string to search for a particular "friend"
    // then return q as the friend result details
    const q = query(UserRef, where("User", "==", "friend"), orderBy('createdAt'))
    
    // real time User collection data
    onSnapshot(UserRef, (snapshot) => {
        let User = []
        snapshot.docs.forEach((doc) => {
            User.push({ ...doc.data(), id: doc.id })
        })
        console.log(User)
    })
}

function collectOneUser(id){
    // id represents a User's unqiue id
    const UserRef = doc(db, 'User')
    const user = query(UserRef, where("id", "=", id))

    onSnapshot(user, (doc) => {
        console.log(doc.data(), doc.id)
    })
}

function collectRevData(){
    //Review collection ref
    const reviewRef = collection(db, 'Review')

    // real time Review collection data
    onSnapshot(reviewRef, (snapshot) => {
        let Review = []
        snapshot.docs.forEach((doc) => {
            Review.push({...doc.data(), id: doc.id})
        })
        console.log(Review)
    })

};

function collectOneRev(id){
    // id represents a User's unqiue id
    const reviewRef = doc(db, 'Review', id)
    const review = query(reviewRef, where("id", "=", id))
    
    // collect all reviews from one user
    onSnapshot(review, (snapshot) => {
        let userRev = []
        snapshot.docs.forEach((doc) => {
            userRev.push({...doc.data(), id: doc.id})
        })
        console.log(userRev)
    })
}

function collectGoalData(){
    const goalRef = doc(db, 'Goal')

    onSnapshot(goalRef, (snapshot) => {
        let Goal = []
        snapshot.docs.forEach((doc) => {
            Goal.push({...doc.data(), id: doc.id})
        })
        console.log(Goal)
    })
}

function collectOneGoal(id){
    // id represents a User's unqiue id
    const goalRef = doc(db, 'Goal', id)
    const goal = query(goalRef, where("id", "=", id))
    
    // collect all goals from one user
    onSnapshot(goal, (snapshot) => {
        let userGoal = []
        snapshot.docs.forEach((doc) => {
            userGoal.push({...doc.data(), id: doc.id})
        })
        console.log(userGoal)
    })
}

function addUserData(id) {
    // add User data
    const addUser = document.querySelector('.add')
    const UserRef = collection(db, 'User')
    const user = query(UserRef, where("id", "=", id))
    addUser.addEventListener('submit', (e) => {
        e.preventDefault()

        addDoc(user, {
            //all the attributes
            password: addUser.password.value,
            firstName: addUser.firstName.value,
            lastName: addUser.lastName.value,
            username: addUser.username.value,
            email: addUser.email.value,
            profile: addUser.profile.value,
            image: addUser.image.value,
            mobile: addUser.mobile.value,
            //goals, Reviews, friends can add separately
            createdAt: serverTimestamp()
        })
        .then(() => {
            addUser.reset()
        })
    })
}

function addRevData(id){
    // add Review data
    const addReview = document.querySelector('.add')
    const reviewRef = collection(db, 'Review')
    const review = query(reviewRef, where("id", "=", id))
    addReview.addEventListener('submit', (e) => {
        e.preventDefault()

        addDoc(review, {
            //all the attributes
            comment: addReview.comment.value,
            name: addReview.name.value,
            rating: addReview.rating.value
        })
    })
}

function addGoalData(id){
    // add Goal data
    const addGoal = document.querySelector('.add')
    const goalRef = collection(db, 'Goal')
    const goal = query(goalRef, where("id", "=", id))

    addGoal.addEventListener('submit', (e) => {
        e.preventDefault()

        addDoc(goal, {
            //all the attributes
            calories: addGoal.calories.value,
            date: addGoal.date.value,
            goalSetting: addGoal.goalSetting.value,
            image: addGoal.image.value,
            name: addGoal.name.value
        })
    })
}

//SEARCH HOW TO DELETE FOR A PARTICULAR DOCUMENT FROM A COLLECTION

function deleteUserData(id) {
    // delete User data
    const deleteUser = document.querySelector('.delete')
    deleteUser.addEventListener('submit', (e) => {
        e.preventDefault
        // require the input field of the document to delete
        const UserRef = doc(db, 'User', id, deleteUser.id.value)

        deleteDoc(UserRef)
            .then(() => {
                deleteUser.reset()
            })
    })
}

function deleteRevData(id){
    // delete Review data
    const deleteReview = document.querySelector('.delete')
    deleteReview.addEventListener('submit', (e) => {
        e.preventDefault
        // require the input field (id) of the review to delete
        const reviewRef = doc(db, 'User', id, deleteReview.id.value)

        deleteDoc(reviewRef)
            .then(() => {
                deleteReview.reset()
            })
    })
}
export {collectUserData, collectOneUser, addUserData, deleteUserData, collectRevData, collectOneRev, addRevData, deleteRevData,
    collectGoalData, collectOneGoal, addGoalData};