// -------------------------------------
// كود فورم التقديم على الوظيفة (يعمل فقط في حال وجوده بالصفحة)
// -------------------------------------
alert("تست: الملف مربوط وصحيح!");
const form = document.getElementById("jobForm");
const message = document.getElementById("message");
const whatsappNumber = "9647822507024";

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
        const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
        const age = document.getElementById("age") ? document.getElementById("age").value.trim() : "";
        const address = document.getElementById("address") ? document.getElementById("address").value.trim() : "";
        const job = document.getElementById("job") ? document.getElementById("job").value : "";
        const notes = document.getElementById("notes") ? document.getElementById("notes").value.trim() : "";

        if (name === "" || phone === "" || age === "" || address === "" || job === "") {
            if (message) {
                message.textContent = "Please complete all required fields.";
                message.style.color = "#ff7777";
            }
            return;
        }

        if (Number(age) < 18 || Number(age) > 70) {
            if (message) {
                message.textContent = "Please enter a valid age.";
                message.style.color = "#ff7777";
            }
            return;
        }

        const orderMessage =
            "طلب التقديم إلى الوظيفة\n" +
            "الاسم: " + name + "\n" +
            "رقم الهاتف: " + phone + "\n" +
            "العمر: " + age + "\n" +
            "السكن: " + address + "\n" +
            "العمل المطلوب: " + job + "\n" +
            "الملاحظات: " + (notes || "None");

        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(orderMessage);

        if (message) {
            message.textContent = "Application is ready to send.";
            message.style.color = "#8ee7a5";
        }

        window.open(whatsappURL, "_blank");
    });
}

// -------------------------------------
// نظام السلة (يعمل بجميع الصفحات)
// -------------------------------------
const CART_KEY = "women_cooking_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(name, price) {
    let cart = getCart();
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name: name, price: Number(price), quantity: 1 });
    }
 saveCart(cart);
            alert(`تمت إضافة "${name}" إلى السلة 🛒`);
    
}

function updateQuantity(index, change) {
    let cart = getCart();
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCartPage();
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
}

function updateCartBadge() {
    let cart = getCart();
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    let badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(badge => badge.innerText = total);
}

function renderCartPage() {
    let container = document.getElementById("cart-items-container");
    let totalEl = document.getElementById("cart-total-price");
    if (!container) return;

    let cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:30px; font-size:18px;'>السلة فارغة حالياً 🛒</p>";
        if (totalEl) totalEl.innerText = "0 د.ع";
        return;
    }

    let totalPrice = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; margin-bottom:10px; background:#fff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);" dir="rtl">
                <div>
                    <strong style="font-size:16px;">${item.name}</strong><br>
                    <small style="color:#666;">السعر المفرد: ${item.price.toLocaleString()} د.ع</small>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="updateQuantity(${index}, -1)" style="padding:4px 10px; cursor:pointer;">-</button>
                    <span style="font-weight:bold;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="padding:4px 10px; cursor:pointer;">+</button>
                    <button onclick="removeItem(${index})" style="color:red; background:none; border:none; margin-right:8px; cursor:pointer; font-weight:bold;">حذف</button>
                </div>
            </div>
        `;
    });

    if (totalEl) totalEl.innerText = `${totalPrice.toLocaleString()} د.ع`;
}

function sendOrderToWhatsApp() {
    let cart = getCart();
    if (cart.length === 0) {
        alert("السلة فارغة، يرجى اختيار الأكلات أولاً!");
        return;
    }

    let phone = "9647822507024";
    let message = "🛒 *طلب جديد الى مطعم طبخ نسوان:*\n";
    message += "-----------------------------------\n";

    let totalPrice = 0;
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        message += `• ${item.name} | العدد: ${item.quantity} | السعر: ${itemTotal.toLocaleString()} د.ع\n`;
    });

    message += "-----------------------------------\n";
    message += `💰 *المجموع الكلي:* ${totalPrice.toLocaleString()} د.ع`;

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    renderCartPage();
});



