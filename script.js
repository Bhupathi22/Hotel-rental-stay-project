// ==================== DATA STRUCTURES ====================

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// Linked List for Users
class UserLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insert(user) {
        const newNode = new Node(user);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) current = current.next;
            current.next = newNode;
        }
        this.size++;
        return user;
    }

    insertAtBeginning(user) {
        const newNode = new Node(user);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return user;
    }

    delete(userId) {
        if (!this.head) return null;
        if (this.head.data.id === userId) {
            const deleted = this.head.data;
            this.head = this.head.next;
            this.size--;
            return deleted;
        }
        let current = this.head;
        while (current.next && current.next.data.id !== userId) current = current.next;
        if (current.next) {
            const deleted = current.next.data;
            current.next = current.next.next;
            this.size--;
            return deleted;
        }
        return null;
    }

    findByUsername(username) {
        let current = this.head;
        while (current) {
            if (current.data.username.toLowerCase() === username.toLowerCase()) return current.data;
            current = current.next;
        }
        return null;
    }

    findByEmail(email) {
        let current = this.head;
        while (current) {
            if (current.data.email.toLowerCase() === email.toLowerCase()) return current.data;
            current = current.next;
        }
        return null;
    }

    findById(id) {
        let current = this.head;
        while (current) {
            if (current.data.id === id) return current.data;
            current = current.next;
        }
        return null;
    }

    validateLogin(username, password, role) {
        let current = this.head;
        while (current) {
            if (current.data.username === username && current.data.password === password && current.data.role === role) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }

    getUsersByRole(role) {
        return this.toArray().filter(u => u.role === role);
    }

    bubbleSortByUsername() {
        if (!this.head || !this.head.next) return;
        let swapped;
        do {
            swapped = false;
            let current = this.head;
            while (current.next) {
                if (current.data.username > current.next.data.username) {
                    [current.data, current.next.data] = [current.next.data, current.data];
                    swapped = true;
                }
                current = current.next;
            }
        } while (swapped);
        console.log("Users sorted by username using Bubble Sort");
    }
}

// Linked List for Properties
class PropertyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insert(property) {
        const newNode = new Node(property);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) current = current.next;
            current.next = newNode;
        }
        this.size++;
        return property;
    }

    delete(propertyId) {
        if (!this.head) return null;
        if (this.head.data.id === propertyId) {
            const deleted = this.head.data;
            this.head = this.head.next;
            this.size--;
            return deleted;
        }
        let current = this.head;
        while (current.next && current.next.data.id !== propertyId) current = current.next;
        if (current.next) {
            const deleted = current.next.data;
            current.next = current.next.next;
            this.size--;
            return deleted;
        }
        return null;
    }

    findById(id) {
        let current = this.head;
        while (current) {
            if (current.data.id === id) return current.data;
            current = current.next;
        }
        return null;
    }

    filterByType(type) {
        const results = [];
        let current = this.head;
        while (current) {
            if (current.data.type.toLowerCase() === type.toLowerCase()) results.push(current.data);
            current = current.next;
        }
        return results;
    }

    filterByLocation(location) {
        const results = [];
        let current = this.head;
        while (current) {
            if (current.data.location.toLowerCase().includes(location.toLowerCase())) results.push(current.data);
            current = current.next;
        }
        return results;
    }

    search(keyword) {
        keyword = keyword.toLowerCase();
        const results = [];
        let current = this.head;
        while (current) {
            if (current.data.title.toLowerCase().includes(keyword) ||
                current.data.location.toLowerCase().includes(keyword) ||
                current.data.description.toLowerCase().includes(keyword)) {
                results.push(current.data);
            }
            current = current.next;
        }
        console.log(`Property search: ${this.size} items scanned`);
        return results;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }

    quickSort(compareFn) {
        const array = this.toArray();
        if (array.length <= 1) return;
        const sorted = this._quickSortHelper(array, compareFn);
        this.head = null;
        this.size = 0;
        sorted.forEach(p => this.insert(p));
    }

    _quickSortHelper(arr, compareFn) {
        if (arr.length <= 1) return arr;
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = [], right = [];
        for (let i = 0; i < arr.length; i++) {
            if (i === Math.floor(arr.length / 2)) continue;
            if (compareFn(arr[i], pivot) < 0) left.push(arr[i]);
            else right.push(arr[i]);
        }
        return [...this._quickSortHelper(left, compareFn), pivot, ...this._quickSortHelper(right, compareFn)];
    }

    getStatistics() {
        const props = this.toArray();
        const stats = {
            total: props.length,
            totalRevenue: 0,
            averagePrice: 0,
            byType: {},
            byLocation: {}
        };
        props.forEach(p => {
            stats.totalRevenue += p.pricePerNight;
            stats.byType[p.type] = (stats.byType[p.type] || 0) + 1;
            const city = p.location.split(',')[0].trim();
            stats.byLocation[city] = (stats.byLocation[city] || 0) + 1;
        });
        stats.averagePrice = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
        return stats;
    }
}

// ==================== CLASS DEFINITIONS ====================

class User {
    constructor(id, username, password, email, role, fullName, phone) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.fullName = fullName || '';
        this.phone = phone || '';
        this.createdAt = new Date();
        this.lastLogin = null;
        this.isActive = true;
        this.bookings = [];
        this.wishlist = [];
    }

    updateLastLogin() { this.lastLogin = new Date(); }
    addBooking(booking) { this.bookings.push(booking); }
    addToWishlist(propertyId) { if (!this.wishlist.includes(propertyId)) this.wishlist.push(propertyId); }
    removeFromWishlist(propertyId) { this.wishlist = this.wishlist.filter(id => id !== propertyId); }
}

class Property {
    constructor(id, title, location, pricePerNight, type, image, bedrooms, bathrooms, amenities, description, guests = 4) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.pricePerNight = pricePerNight;
        this.type = type;
        this.image = image;
        this.bedrooms = bedrooms || 1;
        this.bathrooms = bathrooms || 1;
        this.amenities = amenities || [];
        this.description = description || '';
        this.guests = guests;
        this.status = 'available';
        this.listedAt = new Date();
        this.bookings = [];
        this.rating = 4.5;
        this.reviewCount = 0;
        this.featured = false;
    }

    isAvailable(checkIn, checkOut) {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        for (let booking of this.bookings) {
            const bIn = new Date(booking.checkIn);
            const bOut = new Date(booking.checkOut);
            if ((inDate >= bIn && inDate < bOut) || (outDate > bIn && outDate <= bOut) ||
                (inDate <= bIn && outDate >= bOut)) return false;
        }
        return true;
    }

    addBooking(booking) { this.bookings.push(booking); }
    toggleFeatured() { this.featured = !this.featured; }
}

class Booking {
    constructor(id, propertyId, userId, checkIn, checkOut, guests, totalPrice) {
        this.id = id;
        this.propertyId = propertyId;
        this.userId = userId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guests = guests;
        this.totalPrice = totalPrice;
        this.status = 'confirmed';
        this.bookedAt = new Date();
    }
}

// ==================== APPLICATION STATE ====================

const usersList = new UserLinkedList();
const propertiesList = new PropertyLinkedList();
let currentUser = null;
let nextUserId = 5;
let nextPropertyId = 11;
let nextBookingId = 1;

// ==================== SAMPLE DATA ====================

function initSampleData() {
    // Users
    usersList.insert(new User(1, 'admin', 'admin123', 'admin@vacationstays.com', 'admin', 'System Admin', '+1-888-123-4567'));
    usersList.insert(new User(2, 'john_doe', 'pass123', 'john@email.com', 'user', 'John Doe', '+1-555-111-2222'));
    usersList.insert(new User(3, 'jane_smith', 'pass123', 'jane@email.com', 'user', 'Jane Smith', '+1-555-333-4444'));
    usersList.insert(new User(4, 'mike_wilson', 'pass123', 'mike@email.com', 'user', 'Mike Wilson', '+1-555-555-6666'));

    // Properties
    propertiesList.insert(new Property(1, 'Luxury Beachfront Villa', 'Malibu, CA', 850, 'Villa',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 4, 3, ['Pool', 'WiFi', 'Ocean View'], 'Stunning oceanfront villa with private pool.', 8));
    propertiesList.insert(new Property(2, 'Downtown Loft', 'New York, NY', 320, 'Apartment',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 2, 2, ['WiFi', 'Gym', 'Roof Access'], 'Modern loft in the heart of Manhattan.', 4));
    propertiesList.insert(new Property(3, 'Cozy Mountain Cabin', 'Aspen, CO', 450, 'Cabin',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', 3, 2, ['Fireplace', 'Hot Tub', 'Mountain View'], 'Rustic cabin with breathtaking views.', 6));
    propertiesList.insert(new Property(4, 'Seaside Bungalow', 'Miami, FL', 275, 'Beachfront',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 2, 1, ['Beach Access', 'Patio', 'WiFi'], 'Charming bungalow steps from the sand.', 4));
    propertiesList.insert(new Property(5, 'Modern City Apartment', 'Chicago, IL', 180, 'Apartment',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 1, 1, ['WiFi', 'Parking'], 'Sleek apartment in downtown Chicago.', 2));
    propertiesList.insert(new Property(6, 'Lakefront Retreat', 'Lake Tahoe, CA', 520, 'Villa',
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800', 3, 2, ['Lake View', 'Kayak', 'Fireplace'], 'Peaceful lakefront home with private dock.', 6));
    propertiesList.insert(new Property(7, 'Desert Oasis', 'Palm Springs, CA', 390, 'Villa',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 3, 2, ['Pool', 'Mountain View', 'Outdoor Kitchen'], 'Modern desert villa with pool.', 6));
    propertiesList.insert(new Property(8, 'Ski-in/Ski-out Chalet', 'Vail, CO', 680, 'Cabin',
        'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=800', 4, 3, ['Ski Storage', 'Hot Tub', 'Fireplace'], 'Luxury chalet on the slopes.', 8));
    propertiesList.insert(new Property(9, 'Tropical Paradise', 'Kauai, HI', 750, 'Beachfront',
        'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800', 3, 2, ['Ocean View', 'Outdoor Shower', 'Hammock'], 'Beautiful beach house in Kauai.', 5));
    propertiesList.insert(new Property(10, 'Historic City Center Flat', 'Boston, MA', 210, 'Apartment',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', 1, 1, ['WiFi', 'Historic District'], 'Charming flat in historic Boston.', 2));

    console.log('Sample data initialized. Properties:', propertiesList.size);
}

initSampleData();

// ==================== AUTHENTICATION FUNCTIONS ====================

function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Login to Vacation Stays</h2>
            <div class="auth-tabs">
                <button class="tab-btn active" onclick="switchTab('login')">Login</button>
                <button class="tab-btn" onclick="switchTab('register')">Register</button>
            </div>
            
            <div id="loginForm" class="auth-form active">
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="loginUsername" placeholder="Username">
                </div>
                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="loginPassword" placeholder="Password">
                </div>
                <div class="form-group">
                    <i class="fas fa-user-tag"></i>
                    <select id="loginRole">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button onclick="handleLogin()" class="auth-submit">Login</button>
                <p class="auth-switch">Don't have an account? <a onclick="switchTab('register')">Register</a></p>
            </div>

            <div id="registerForm" class="auth-form">
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="regFullName" placeholder="Full Name">
                </div>
                <div class="form-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="regEmail" placeholder="Email">
                </div>
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="regUsername" placeholder="Username">
                </div>
                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="regPassword" placeholder="Password">
                </div>
                <div class="form-group">
                    <i class="fas fa-phone"></i>
                    <input type="tel" id="regPhone" placeholder="Phone Number">
                </div>
                <div class="form-group">
                    <i class="fas fa-user-tag"></i>
                    <select id="regRole">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button onclick="handleRegister()" class="auth-submit">Register</button>
                <p class="auth-switch">Already have an account? <a onclick="switchTab('login')">Login</a></p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    window.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function switchTab(tab) {
    document.getElementById('loginForm').classList.toggle('active', tab === 'login');
    document.getElementById('registerForm').classList.toggle('active', tab === 'register');
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
    });
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    if (!username || !password) return showNotification('Please fill in all fields', 'error');

    const user = usersList.validateLogin(username, password, role);
    if (user) {
        currentUser = user;
        user.updateLastLogin();
        updateUIForLogin(user);
        document.querySelector('.auth-modal')?.remove();
        showNotification(`Welcome back, ${user.fullName || user.username}!`, 'success');
        if (user.role === 'admin') showAdminPanel();
        displayProperties(); // Refresh grid
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function handleRegister() {
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const role = document.getElementById('regRole').value;

    if (!fullName || !email || !username || !password || !phone) 
        return showNotification('Please fill in all fields', 'error');

    if (usersList.findByUsername(username)) 
        return showNotification('Username already exists!', 'error');
    if (usersList.findByEmail(email)) 
        return showNotification('Email already registered!', 'error');

    const newUser = new User(nextUserId++, username, password, email, role, fullName, phone);
    usersList.insert(newUser);
    showNotification('Registration successful! Please login.', 'success');
    switchTab('login');
    document.getElementById('regFullName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPhone').value = '';
}

function logout() {
    if (currentUser) {
        console.log(`User logged out: ${currentUser.username}`);
        currentUser = null;
        updateUIForLogout();
        document.getElementById('adminPanel')?.remove();
        showNotification('Logged out successfully', 'info');
        displayProperties();
    }
}

function updateUIForLogin(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-greeting">Welcome, ${user.fullName || user.username}</span>
            <button class="btn btn-logout" onclick="logout()">Logout</button>
        `;
    }
}

function updateUIForLogout() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-login" onclick="showLoginModal()">Login</button>
            <button class="btn btn-register" onclick="showLoginModal()">Register</button>
        `;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ==================== PROPERTY DISPLAY ====================

function displayProperties(filter = 'All Stays') {
    const grid = document.getElementById('propertyGrid');
    let properties = propertiesList.toArray();

    if (filter !== 'All Stays') {
        properties = properties.filter(p => p.type.toLowerCase() === filter.toLowerCase());
    }

    grid.innerHTML = '';
    if (properties.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color:#aaa;">No properties match this category.</p>';
        return;
    }

    properties.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image">
                <img src="${prop.image}" alt="${prop.title}">
                <div class="property-badge">${prop.type}</div>
            </div>
            <div class="property-info">
                <div class="property-header">
                    <h3>${prop.title}</h3>
                    <span class="location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</span>
                </div>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${prop.bedrooms} BR</span>
                    <span><i class="fas fa-bath"></i> ${prop.bathrooms} BA</span>
                    <span><i class="fas fa-users"></i> ${prop.guests} Guests</span>
                </div>
                <div class="property-price">
                    $${prop.pricePerNight} <small>per night</small>
                </div>
                <button class="book-btn" onclick="openBookingModal(${prop.id})">Book Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openBookingModal(propertyId) {
    if (!currentUser) return showNotification('Please login to book a stay', 'error');
    const property = propertiesList.findById(propertyId);
    if (!property) return;

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <span class="close-modal">&times;</span>
            <h2>Book ${property.title}</h2>
            <div class="form-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="date" id="checkIn" placeholder="Check-in">
            </div>
            <div class="form-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="date" id="checkOut" placeholder="Check-out">
            </div>
            <div class="form-group">
                <i class="fas fa-users"></i>
                <input type="number" id="guests" min="1" max="${property.guests}" value="2">
            </div>
            <p>Price per night: $${property.pricePerNight}</p>
            <p id="totalPrice">Total: $0</p>
            <button onclick="confirmBooking(${propertyId})" class="auth-submit">Confirm Booking</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();

    const checkIn = modal.querySelector('#checkIn');
    const checkOut = modal.querySelector('#checkOut');
    const guests = modal.querySelector('#guests');
    const totalSpan = modal.querySelector('#totalPrice');

    function updateTotal() {
        if (checkIn.value && checkOut.value) {
            const days = Math.ceil((new Date(checkOut.value) - new Date(checkIn.value)) / (1000*60*60*24));
            if (days > 0) totalSpan.textContent = `Total: $${days * property.pricePerNight * guests.value}`;
        }
    }
    checkIn.addEventListener('change', updateTotal);
    checkOut.addEventListener('change', updateTotal);
    guests.addEventListener('input', updateTotal);
}

function confirmBooking(propertyId) {
    const property = propertiesList.findById(propertyId);
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = parseInt(document.getElementById('guests').value);

    if (!checkIn || !checkOut || !guests) return showNotification('Please fill all fields', 'error');
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    if (days <= 0) return showNotification('Check-out must be after check-in', 'error');

    if (!property.isAvailable(checkIn, checkOut)) return showNotification('Property not available for those dates', 'error');

    const totalPrice = days * property.pricePerNight * guests;
    const booking = new Booking(nextBookingId++, propertyId, currentUser.id, checkIn, checkOut, guests, totalPrice);
    property.addBooking(booking);
    currentUser.addBooking(booking);
    showNotification('Booking confirmed!', 'success');
    document.querySelector('.auth-modal').remove();
}

// ==================== ADMIN PANEL ====================

function showAdminPanel() {
    document.getElementById('adminPanel')?.remove();
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-header">
            <h3><i class="fas fa-crown"></i> Admin Dashboard</h3>
            <button class="btn-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="admin-stats">
            <div class="stat-card"><i class="fas fa-users"></i><div class="stat-info"><span class="stat-value">${usersList.size}</span><span class="stat-label">Total Users</span></div></div>
            <div class="stat-card"><i class="fas fa-home"></i><div class="stat-info"><span class="stat-value">${propertiesList.size}</span><span class="stat-label">Properties</span></div></div>
            <div class="stat-card"><i class="fas fa-calendar-check"></i><div class="stat-info"><span class="stat-value">${propertiesList.toArray().reduce((acc, p) => acc + p.bookings.length, 0)}</span><span class="stat-label">Bookings</span></div></div>
            <div class="stat-card"><i class="fas fa-dollar-sign"></i><div class="stat-info"><span class="stat-value">$${Math.round(propertiesList.getStatistics().totalRevenue)}</span><span class="stat-label">Revenue</span></div></div>
        </div>
        <div class="admin-tabs">
            <button class="admin-tab active" onclick="switchAdminTab('properties')">Manage Properties</button>
            <button class="admin-tab" onclick="switchAdminTab('users')">Manage Users</button>
            <button class="admin-tab" onclick="switchAdminTab('analytics')">Analytics</button>
        </div>
        <div id="adminPropertiesTab" class="admin-tab-content active">
            <div class="admin-actions">
                <h4>Add New Property</h4>
                <div class="add-property-form">
                    <input type="text" id="propTitle" placeholder="Title">
                    <input type="text" id="propLocation" placeholder="Location (e.g., City, State)">
                    <input type="number" id="propPrice" placeholder="Price per night">
                    <input type="text" id="propType" placeholder="Type (Villa/Apartment/Beachfront/Cabin)">
                    <input type="text" id="propImage" placeholder="Image URL">
                    <input type="number" id="propBedrooms" placeholder="Bedrooms">
                    <input type="number" id="propBathrooms" placeholder="Bathrooms">
                    <input type="number" id="propGuests" placeholder="Max guests">
                    <textarea id="propDesc" placeholder="Description"></textarea>
                    <button onclick="addProperty()" class="btn-add">Add Property</button>
                </div>
            </div>
            <div class="property-list-admin">
                <h4>Property Inventory</h4>
                <div class="admin-filters">
                    <input type="text" id="searchProp" placeholder="Search properties..." onkeyup="searchProperties(this.value)">
                    <select onchange="filterPropertiesByType(this.value)">
                        <option value="all">All Types</option>
                        <option value="Villa">Villas</option>
                        <option value="Apartment">Apartments</option>
                        <option value="Beachfront">Beachfront</option>
                        <option value="Cabin">Cabins</option>
                    </select>
                    <select onchange="sortProperties(this.value)">
                        <option value="price">Sort by Price</option>
                        <option value="title">Sort by Title</option>
                        <option value="location">Sort by Location</option>
                    </select>
                </div>
                <div id="propertyAdminList" class="property-admin-grid"></div>
            </div>
        </div>
        <div id="adminUsersTab" class="admin-tab-content">
            <h4>User Management</h4>
            <div class="user-list-admin">
                <div class="user-filters">
                    <input type="text" id="searchUser" placeholder="Search users..." onkeyup="searchUsers(this.value)">
                    <select onchange="filterUsersByRole(this.value)">
                        <option value="all">All Users</option>
                        <option value="user">Regular Users</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
                <div id="userAdminList" class="user-admin-grid"></div>
            </div>
        </div>
        <div id="adminAnalyticsTab" class="admin-tab-content">
            <h4>System Analytics</h4>
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h5>Property Distribution by Type</h5>
                    <canvas id="typeChart"></canvas>
                </div>
                <div class="analytics-card">
                    <h5>Recent Bookings</h5>
                    <div id="recentBookings"></div>
                </div>
            </div>
        </div>
    `;
    document.querySelector('.featured').insertAdjacentElement('beforebegin', panel);
    displayPropertiesAdmin();
    displayUsersAdmin();
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach((t, i) => t.classList.toggle('active', (i === 0 && tab==='properties') || (i===1 && tab==='users') || (i===2 && tab==='analytics')));
    document.querySelectorAll('.admin-tab-content').forEach((c, i) => c.classList.toggle('active', (i === 0 && tab==='properties') || (i===1 && tab==='users') || (i===2 && tab==='analytics')));
    if (tab === 'properties') displayPropertiesAdmin();
    if (tab === 'users') displayUsersAdmin();
    if (tab === 'analytics') loadAnalytics();
}

function addProperty() {
    if (!currentUser || currentUser.role !== 'admin') return showNotification('Only admins can add properties', 'error');
    const title = document.getElementById('propTitle').value;
    const location = document.getElementById('propLocation').value;
    const price = parseFloat(document.getElementById('propPrice').value);
    const type = document.getElementById('propType').value;
    const image = document.getElementById('propImage').value || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
    const bedrooms = parseInt(document.getElementById('propBedrooms').value) || 1;
    const bathrooms = parseInt(document.getElementById('propBathrooms').value) || 1;
    const guests = parseInt(document.getElementById('propGuests').value) || 2;
    const desc = document.getElementById('propDesc').value || '';

    if (!title || !location || !price || !type) return showNotification('Please fill required fields', 'error');

    const newProp = new Property(nextPropertyId++, title, location, price, type, image, bedrooms, bathrooms, [], desc, guests);
    propertiesList.insert(newProp);
    // Clear form
    document.getElementById('propTitle').value = '';
    document.getElementById('propLocation').value = '';
    document.getElementById('propPrice').value = '';
    document.getElementById('propType').value = '';
    document.getElementById('propImage').value = '';
    document.getElementById('propBedrooms').value = '';
    document.getElementById('propBathrooms').value = '';
    document.getElementById('propGuests').value = '';
    document.getElementById('propDesc').value = '';
    displayPropertiesAdmin();
    displayProperties();
    showNotification('Property added!', 'success');
}

function deleteProperty(id) {
    if (currentUser?.role === 'admin' && confirm('Delete this property?')) {
        propertiesList.delete(id);
        displayPropertiesAdmin();
        displayProperties();
        showNotification('Property deleted', 'success');
    }
}

function editProperty(id) {
    const prop = propertiesList.findById(id);
    if (!prop) return;
    document.getElementById('propTitle').value = prop.title;
    document.getElementById('propLocation').value = prop.location;
    document.getElementById('propPrice').value = prop.pricePerNight;
    document.getElementById('propType').value = prop.type;
    document.getElementById('propImage').value = prop.image;
    document.getElementById('propBedrooms').value = prop.bedrooms;
    document.getElementById('propBathrooms').value = prop.bathrooms;
    document.getElementById('propGuests').value = prop.guests;
    document.getElementById('propDesc').value = prop.description;
    // Change add button to update
    const addBtn = document.querySelector('.btn-add');
    addBtn.textContent = 'Update Property';
    addBtn.onclick = () => updateProperty(id);
}

function updateProperty(id) {
    const prop = propertiesList.findById(id);
    if (!prop) return;
    prop.title = document.getElementById('propTitle').value;
    prop.location = document.getElementById('propLocation').value;
    prop.pricePerNight = parseFloat(document.getElementById('propPrice').value);
    prop.type = document.getElementById('propType').value;
    prop.image = document.getElementById('propImage').value;
    prop.bedrooms = parseInt(document.getElementById('propBedrooms').value) || 1;
    prop.bathrooms = parseInt(document.getElementById('propBathrooms').value) || 1;
    prop.guests = parseInt(document.getElementById('propGuests').value) || 2;
    prop.description = document.getElementById('propDesc').value;
    // Reset form
    document.getElementById('propTitle').value = '';
    document.getElementById('propLocation').value = '';
    document.getElementById('propPrice').value = '';
    document.getElementById('propType').value = '';
    document.getElementById('propImage').value = '';
    document.getElementById('propBedrooms').value = '';
    document.getElementById('propBathrooms').value = '';
    document.getElementById('propGuests').value = '';
    document.getElementById('propDesc').value = '';
    const addBtn = document.querySelector('.btn-add');
    addBtn.textContent = 'Add Property';
    addBtn.onclick = addProperty;
    displayPropertiesAdmin();
    displayProperties();
    showNotification('Property updated', 'success');
}

function displayPropertiesAdmin() {
    const container = document.getElementById('propertyAdminList');
    if (!container) return;
    const props = propertiesList.toArray();
    if (!props.length) return container.innerHTML = '<p class="no-data">No properties.</p>';
    container.innerHTML = props.map(p => `
        <div class="property-admin-card">
            <img src="${p.image}" alt="${p.title}">
            <div class="property-info">
                <h4>${p.title}</h4>
                <p>${p.location} | $${p.pricePerNight}/night</p>
                <p>Type: ${p.type} | Bedrooms: ${p.bedrooms}</p>
            </div>
            <div class="property-actions">
                <button onclick="editProperty(${p.id})" class="btn-edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteProperty(${p.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
                <button onclick="togglePropertyFeature(${p.id})" class="btn-feature"><i class="fas ${p.featured ? 'fa-star' : 'fa-star-o'}"></i></button>
            </div>
        </div>
    `).join('');
}

function displayUsersAdmin() {
    const container = document.getElementById('userAdminList');
    if (!container) return;
    const users = usersList.toArray();
    if (!users.length) return container.innerHTML = '<p class="no-data">No users.</p>';
    container.innerHTML = users.map(u => `
        <div class="user-admin-card">
            <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="user-info">
                <h4>${u.fullName || u.username}</h4>
                <p><i class="fas fa-envelope"></i> ${u.email}</p>
                <p><i class="fas fa-phone"></i> ${u.phone || 'N/A'}</p>
                <p><i class="fas fa-tag"></i> ${u.role}</p>
                <p><i class="fas fa-calendar"></i> Joined: ${new Date(u.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="user-actions">
                <button onclick="toggleUserStatus(${u.id})" class="btn-status"><i class="fas ${u.isActive ? 'fa-toggle-on' : 'fa-toggle-off'}"></i></button>
                <button onclick="deleteUser(${u.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function searchProperties(keyword) {
    if (!keyword.trim()) return displayPropertiesAdmin();
    const results = propertiesList.search(keyword);
    const container = document.getElementById('propertyAdminList');
    if (!results.length) return container.innerHTML = '<p class="no-data">No matches.</p>';
    container.innerHTML = results.map(p => `
        <div class="property-admin-card">
            <img src="${p.image}" alt="${p.title}">
            <div class="property-info">
                <h4>${p.title}</h4>
                <p>${p.location} | $${p.pricePerNight}/night</p>
            </div>
            <div class="property-actions">
                <button onclick="editProperty(${p.id})" class="btn-edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteProperty(${p.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterPropertiesByType(type) {
    if (type === 'all') return displayPropertiesAdmin();
    const filtered = propertiesList.filterByType(type);
    const container = document.getElementById('propertyAdminList');
    if (!filtered.length) return container.innerHTML = '<p class="no-data">No properties of this type.</p>';
    container.innerHTML = filtered.map(p => `
        <div class="property-admin-card">
            <img src="${p.image}" alt="${p.title}">
            <div class="property-info">
                <h4>${p.title}</h4>
                <p>${p.location} | $${p.pricePerNight}/night</p>
            </div>
            <div class="property-actions">
                <button onclick="editProperty(${p.id})" class="btn-edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteProperty(${p.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function sortProperties(criteria) {
    const compare = {
        price: (a,b) => a.pricePerNight - b.pricePerNight,
        title: (a,b) => a.title.localeCompare(b.title),
        location: (a,b) => a.location.localeCompare(b.location)
    }[criteria];
    propertiesList.quickSort(compare);
    displayPropertiesAdmin();
    displayProperties();
}

function searchUsers(keyword) {
    if (!keyword.trim()) return displayUsersAdmin();
    keyword = keyword.toLowerCase();
    const filtered = usersList.toArray().filter(u => 
        u.username.toLowerCase().includes(keyword) ||
        (u.fullName && u.fullName.toLowerCase().includes(keyword)) ||
        u.email.toLowerCase().includes(keyword)
    );
    const container = document.getElementById('userAdminList');
    if (!filtered.length) return container.innerHTML = '<p class="no-data">No users match.</p>';
    container.innerHTML = filtered.map(u => `
        <div class="user-admin-card">
            <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="user-info">
                <h4>${u.fullName || u.username}</h4>
                <p><i class="fas fa-envelope"></i> ${u.email}</p>
            </div>
            <div class="user-actions">
                <button onclick="toggleUserStatus(${u.id})" class="btn-status"><i class="fas ${u.isActive ? 'fa-toggle-on' : 'fa-toggle-off'}"></i></button>
            </div>
        </div>
    `).join('');
}

function filterUsersByRole(role) {
    if (role === 'all') return displayUsersAdmin();
    const filtered = usersList.getUsersByRole(role);
    const container = document.getElementById('userAdminList');
    if (!filtered.length) return container.innerHTML = '<p class="no-data">No users with that role.</p>';
    container.innerHTML = filtered.map(u => `
        <div class="user-admin-card">
            <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="user-info">
                <h4>${u.fullName || u.username}</h4>
                <p><i class="fas fa-envelope"></i> ${u.email}</p>
                <p><i class="fas fa-tag"></i> ${u.role}</p>
            </div>
        </div>
    `).join('');
}

function toggleUserStatus(id) {
    const user = usersList.findById(id);
    if (user) {
        user.isActive = !user.isActive;
        displayUsersAdmin();
        showNotification(`User ${user.isActive ? 'activated' : 'deactivated'}`, 'info');
    }
}

function deleteUser(id) {
    if (currentUser?.role === 'admin' && confirm('Delete this user?')) {
        usersList.delete(id);
        displayUsersAdmin();
        showNotification('User deleted', 'success');
    }
}

function togglePropertyFeature(id) {
    const prop = propertiesList.findById(id);
    if (prop) {
        prop.toggleFeatured();
        displayPropertiesAdmin();
        displayProperties();
    }
}

function loadAnalytics() {
    // Placeholder for charts – you can integrate Chart.js if desired
    const recentDiv = document.getElementById('recentBookings');
    if (recentDiv) {
        recentDiv.innerHTML = '<p>Booking analytics would be shown here with Chart.js</p>';
    }
}

// ==================== ADDITIONAL STYLES (injected) ====================

const styles = `
    /* Auth Modal */
    .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    }
    .auth-modal-content {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border-radius: 20px;
        padding: 2rem;
        width: 90%;
        max-width: 450px;
        position: relative;
        border: 1px solid rgba(0, 180, 216, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .close-modal {
        position: absolute;
        right: 1.5rem;
        top: 1rem;
        font-size: 2rem;
        color: #00b4d8;
        cursor: pointer;
        transition: 0.3s;
    }
    .close-modal:hover { transform: rotate(90deg); }
    .auth-modal h2 { color: #00b4d8; margin-bottom: 2rem; text-align: center; }
    .auth-tabs {
        display: flex;
        margin-bottom: 2rem;
        border-bottom: 1px solid rgba(0, 180, 216, 0.2);
    }
    .tab-btn {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.1rem;
        cursor: pointer;
        transition: 0.3s;
    }
    .tab-btn.active {
        color: #00b4d8;
        border-bottom: 2px solid #00b4d8;
    }
    .auth-form { display: none; }
    .auth-form.active { display: block; }
    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    .form-group i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #00b4d8;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(0, 180, 216, 0.2);
        border-radius: 10px;
        color: #fff;
        font-size: 1rem;
        transition: 0.3s;
    }
    .form-group textarea { min-height: 100px; resize: vertical; }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        border-color: #00b4d8;
        outline: none;
        box-shadow: 0 0 10px rgba(0, 180, 216, 0.3);
    }
    .auth-submit {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #00b4d8, #0077b6);
        border: none;
        border-radius: 10px;
        color: #0f172a;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
        transition: 0.3s;
        margin-top: 1rem;
    }
    .auth-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 180, 216, 0.3);
    }
    .auth-switch {
        text-align: center;
        margin-top: 1.5rem;
        color: rgba(255, 255, 255, 0.7);
    }
    .auth-switch a {
        color: #00b4d8;
        cursor: pointer;
        text-decoration: none;
    }
    .auth-switch a:hover { text-decoration: underline; }
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        background: white;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10001;
        animation: slideIn 0.3s;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .notification.success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .notification.error { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .notification.info { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
    .notification i { font-size: 1.5rem; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* Admin Panel */
    .admin-panel {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border-radius: 20px;
        padding: 2rem;
        margin: 2rem 5%;
        border: 1px solid rgba(0, 180, 216, 0.2);
        position: relative;
        animation: slideUp 0.5s;
    }
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .admin-header h3 { color: #00b4d8; font-size: 1.8rem; }
    .admin-header h3 i { margin-right: 10px; }
    .btn-close {
        background: none;
        border: none;
        color: #00b4d8;
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s;
    }
    .btn-close:hover { transform: rotate(90deg); }
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .stat-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid rgba(0, 180, 216, 0.1);
    }
    .stat-card i { font-size: 2.5rem; color: #00b4d8; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #00b4d8; }
    .stat-label { color: rgba(255, 255, 255, 0.7); }
    .admin-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid rgba(0, 180, 216, 0.2);
        padding-bottom: 1rem;
    }
    .admin-tab {
        padding: 0.8rem 2rem;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        transition: 0.3s;
        border-radius: 10px;
    }
    .admin-tab.active { background: linear-gradient(135deg, #00b4d8, #0077b6); color: #0f172a; }
    .admin-tab-content { display: none; }
    .admin-tab-content.active { display: block; }
    .add-property-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 15px;
    }
    .btn-add {
        padding: 1rem;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: 0.3s;
        grid-column: span 2;
    }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
    .admin-filters, .user-filters {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        flex-wrap: wrap;
    }
    .admin-filters input, .admin-filters select, .user-filters input, .user-filters select {
        padding: 0.8rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(0, 180, 216, 0.2);
        border-radius: 10px;
        color: #fff;
        flex: 1;
        min-width: 200px;
    }
    .property-admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    .property-admin-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(0, 180, 216, 0.1);
        transition: 0.3s;
    }
    .property-admin-card:hover { transform: translateY(-5px); border-color: #00b4d8; }
    .property-admin-card img { width: 100%; height: 180px; object-fit: cover; }
    .property-admin-card .property-info { padding: 1.5rem; }
    .property-admin-card h4 { color: #00b4d8; margin-bottom: 0.5rem; }
    .property-actions {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid rgba(0, 180, 216, 0.1);
    }
    .property-actions button, .user-actions button {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    .btn-edit:hover { background: #3b82f6; }
    .btn-delete:hover { background: #ef4444; }
    .btn-feature:hover { background: #00b4d8; color: #0f172a; }
    .user-admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    .user-admin-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 1.5rem;
        display: flex;
        gap: 1.5rem;
        border: 1px solid rgba(0, 180, 216, 0.1);
    }
    .user-avatar i { font-size: 4rem; color: #00b4d8; }
    .user-info { flex: 1; }
    .user-info h4 { color: #00b4d8; margin-bottom: 0.5rem; }
    .user-info p { color: rgba(255, 255, 255, 0.7); margin: 0.3rem 0; font-size: 0.9rem; }
    .user-info i { width: 20px; color: #00b4d8; margin-right: 5px; }
    .user-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .btn-status { background: rgba(16, 185, 129, 0.2) !important; color: #10b981 !important; }
    .user-greeting { color: #00b4d8; font-weight: 600; margin-right: 1rem; }
    .btn-logout { background: #ef4444 !important; color: white !important; }
    .btn-logout:hover { background: #dc2626 !important; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading after a short delay (already handled by inline script, but just in case)
    setTimeout(() => {
        const loader = document.getElementById('loading');
        if (loader) loader.classList.add('hidden');
    }, 600);

    // Attach login/register buttons (initial state)
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (registerBtn) registerBtn.addEventListener('click', showLoginModal);

    // Hero buttons
    document.querySelector('.btn-primary')?.addEventListener('click', () => 
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })
    );
    document.querySelector('.btn-secondary')?.addEventListener('click', () => 
        document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
    );

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayProperties(this.textContent);
        });
    });

    // Newsletter
    document.querySelector('.newsletter-form button')?.addEventListener('click', () => {
        const email = document.querySelector('.newsletter-form input').value;
        if (email) {
            showNotification('Subscribed! (Demo)', 'success');
            document.querySelector('.newsletter-form input').value = '';
        } else {
            showNotification('Enter email', 'error');
        }
    });

    // Initial display
    displayProperties();
});