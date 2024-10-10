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
    // Disable the upload button to prevent duplicate submissions
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = true;

    const productDesc = document.getElementById('productDesc').value;
    const productPrice = document.getElementById('productPrice').value;
    const sellerPhone = document.getElementById('sellerPhone').value;
    const fileInput = document.getElementById('fileInput').files[0];

    // Validate form fields
    if (!productDesc || !productPrice || !sellerPhone || !fileInput) {
        alert("Please fill all fields and select an image.");
        uploadBtn.disabled = false; // Re-enable the button if validation fails
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
        
        // Clear the input fields after successful submission
        clearInputFields();

    } catch (error) {
        console.error("Error uploading product:", error);
        alert("Error uploading product.");
    } finally {
        // Re-enable the button after upload is complete (or failed)
        uploadBtn.disabled = false;
    }
}

// Function to clear all input fields
function clearInputFields() {
    document.getElementById('productDesc').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('sellerPhone').value = '';
    document.getElementById('fileInput').value = ''; // Reset file input
}

// Upload image to Firebase Storage
async function uploadImage(file) {
    const storageRef = storage.ref();
    const fileRef = storageRef.child('products/' + file.name);
    await fileRef.put(file);
    return fileRef.getDownloadURL();
}

// Add event listener to the upload button
document.getElementById('uploadBtn').addEventListener('click', uploadProduct);
