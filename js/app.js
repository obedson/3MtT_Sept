// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyAT0sl_f26UP7MwIVxWJMvaz52_HodsSYY",
    authDomain: "mtt-d130b.firebaseapp.com",
    projectId: "mtt-d130b",
    storageBucket: "mtt-d130b.appspot.com",
    messagingSenderId: "103379427385",
    appId: "1:103379427385:web:672ee6ff76784954082de8",
    measurementId: "G-YXQCJLM1T9"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Upload product details to Firebase
async function uploadProduct() {
    const productDesc = document.getElementById('productDesc').value;
    const productPrice = document.getElementById('productPrice').value;
    const sellerPhone = document.getElementById('sellerPhone').value;
    const fileInput = document.getElementById('fileInput').files[0];

    if (!productDesc || !productPrice || !sellerPhone || !fileInput) {
        alert("Please fill all fields and select an image.");
        return;
    }

    try {
        const imageUrl = await uploadImage(fileInput);
        const whatsappLink = `https://wa.me/${sellerPhone.replace(/\D/g, '')}`;

        const docRef = await db.collection('products').add({
            description: productDesc,
            price: productPrice,
            sellerPhone: sellerPhone,
            whatsappLink: whatsappLink,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Product uploaded successfully!");
        document.getElementById('productForm').reset();
    } catch (error) {
        console.error("Error uploading product:", error);
        alert("Error uploading product.");
    }
}

// Upload image to Firebase Storage
async function uploadImage(file) {
    const storageRef = storage.ref();
    const fileRef = storageRef.child('products/' + file.name);
    await fileRef.put(file);
    return fileRef.getDownloadURL();
}
