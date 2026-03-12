import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Console-based Vacation Rental Booking System
 * Inspired by the provided HTML/CSS frontend.
 */
public class VacationRentalApp {
    private static Scanner scanner = new Scanner(System.in);
    private static List<Property> properties = new ArrayList<>();
    private static List<User> users = new ArrayList<>();
    private static List<Booking> bookings = new ArrayList<>();
    private static User currentUser = null;
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static void main(String[] args) {
        initializeSampleData();
        showLoadingScreen();

        while (true) {
            if (currentUser == null) {
                showMainMenu();
            } else {
                showUserMenu();
            }
        }
    }

    private static void showLoadingScreen() {
        System.out.println("\n✦ VACATION STAYS ✦");
        System.out.println("Your gateway to the perfect getaway");
        try {
            Thread.sleep(500); // Simulate loading
        } catch (InterruptedException e) {
            // ignore
        }
    }

    // ==================== MENUS ====================

    private static void showMainMenu() {
        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║       MAIN MENU           ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ 1. Login                   ║");
        System.out.println("║ 2. Register                ║");
        System.out.println("║ 3. Browse Properties       ║");
        System.out.println("║ 4. Exit                    ║");
        System.out.println("╚════════════════════════════╝");
        System.out.print("Choose option: ");

        String choice = scanner.nextLine();
        switch (choice) {
            case "1": login(); break;
            case "2": register(); break;
            case "3": browseProperties(false); break;
            case "4": System.out.println("Thank you for using Vacation Stays. Goodbye!"); System.exit(0);
            default: System.out.println("Invalid option. Try again.");
        }
    }

    private static void showUserMenu() {
        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║       USER MENU            ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ 1. Browse Properties       ║");
        System.out.println("║ 2. My Bookings             ║");
        System.out.println("║ 3. Book a Property         ║");
        System.out.println("║ 4. " + (currentUser.isAdmin() ? "Admin Panel" : "Logout") + "           ║");
        System.out.println("║ 5. Exit                    ║");
        System.out.println("╚════════════════════════════╝");
        System.out.print("Choose option: ");

        String choice = scanner.nextLine();
        switch (choice) {
            case "1": browseProperties(true); break;
            case "2": viewMyBookings(); break;
            case "3": bookProperty(); break;
            case "4":
                if (currentUser.isAdmin()) {
                    adminPanel();
                } else {
                    logout();
                }
                break;
            case "5": System.out.println("Thank you for using Vacation Stays. Goodbye!"); System.exit(0);
            default: System.out.println("Invalid option. Try again.");
        }
    }

    private static void adminPanel() {
        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║       ADMIN PANEL          ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ 1. Add New Property        ║");
        System.out.println("║ 2. View All Bookings       ║");
        System.out.println("║ 3. View All Users          ║");
        System.out.println("║ 4. Back to User Menu       ║");
        System.out.println("╚════════════════════════════╝");
        System.out.print("Choose option: ");

        String choice = scanner.nextLine();
        switch (choice) {
            case "1": addProperty(); break;
            case "2": viewAllBookings(); break;
            case "3": viewAllUsers(); break;
            case "4": return;
            default: System.out.println("Invalid option.");
        }
    }

    // ==================== AUTHENTICATION ====================

    private static void login() {
        System.out.print("Username: ");
        String username = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();

        for (User user : users) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                currentUser = user;
                System.out.println("Welcome back, " + username + "!");
                return;
            }
        }
        System.out.println("Invalid credentials.");
    }

    private static void register() {
        System.out.print("Choose username: ");
        String username = scanner.nextLine();
        // Check if username exists
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                System.out.println("Username already taken.");
                return;
            }
        }
        System.out.print("Password: ");
        String password = scanner.nextLine();
        System.out.print("Email: ");
        String email = scanner.nextLine();

        // Simple role assignment: first user becomes admin? Or always customer? 
        // For demo, make first user admin
        boolean isAdmin = users.isEmpty();
        User newUser = new User(username, password, email, isAdmin);
        users.add(newUser);
        System.out.println("Registration successful! Please login.");
    }

    private static void logout() {
        currentUser = null;
        System.out.println("Logged out.");
    }

    // ==================== PROPERTY BROWSING ====================

    private static void browseProperties(boolean showBookingOption) {
        if (properties.isEmpty()) {
            System.out.println("No properties available.");
            return;
        }

        System.out.println("\n--- Available Properties ---");
        for (int i = 0; i < properties.size(); i++) {
            Property p = properties.get(i);
            System.out.printf("%d. %s | %s | %s | $%.2f/night | %d beds, %d baths, max %d guests\n",
                    i + 1, p.getName(), p.getLocation(), p.getType(), p.getPricePerNight(),
                    p.getBedrooms(), p.getBathrooms(), p.getMaxGuests());
        }

        if (showBookingOption && currentUser != null) {
            System.out.print("\nEnter property number to view details (or 0 to go back): ");
            try {
                int choice = Integer.parseInt(scanner.nextLine());
                if (choice > 0 && choice <= properties.size()) {
                    showPropertyDetails(properties.get(choice - 1));
                }
            } catch (NumberFormatException e) {
                // just ignore
            }
        }
    }

    private static void showPropertyDetails(Property p) {
        System.out.println("\n✦ " + p.getName() + " ✦");
        System.out.println("Location: " + p.getLocation());
        System.out.println("Type: " + p.getType());
        System.out.println("Price: $" + p.getPricePerNight() + " per night");
        System.out.println("Bedrooms: " + p.getBedrooms() + " | Bathrooms: " + p.getBathrooms() + " | Max Guests: " + p.getMaxGuests());
        System.out.println("Description: " + p.getDescription());

        if (currentUser != null) {
            System.out.println("\nOptions:");
            System.out.println("1. Book this property");
            System.out.println("2. Go back");
            System.out.print("Choose: ");
            String opt = scanner.nextLine();
            if ("1".equals(opt)) {
                bookSpecificProperty(p);
            }
        }
    }

    // ==================== BOOKING ====================

    private static void bookProperty() {
        browseProperties(true); // Let user pick from list
    }

    private static void bookSpecificProperty(Property property) {
        System.out.println("\n--- Booking " + property.getName() + " ---");
        LocalDate checkIn = null;
        LocalDate checkOut = null;

        // Get check-in date
        while (checkIn == null) {
            System.out.print("Check-in date (yyyy-mm-dd): ");
            try {
                checkIn = LocalDate.parse(scanner.nextLine(), DATE_FORMAT);
                if (checkIn.isBefore(LocalDate.now())) {
                    System.out.println("Check-in cannot be in the past.");
                    checkIn = null;
                }
            } catch (DateTimeParseException e) {
                System.out.println("Invalid date format.");
            }
        }

        // Get check-out date
        while (checkOut == null) {
            System.out.print("Check-out date (yyyy-mm-dd): ");
            try {
                checkOut = LocalDate.parse(scanner.nextLine(), DATE_FORMAT);
                if (!checkOut.isAfter(checkIn)) {
                    System.out.println("Check-out must be after check-in.");
                    checkOut = null;
                }
            } catch (DateTimeParseException e) {
                System.out.println("Invalid date format.");
            }
        }

        // Check availability (simplified: assume always available)
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        double total = nights * property.getPricePerNight();

        System.out.println("\nBooking Summary:");
        System.out.println("Property: " + property.getName());
        System.out.println("Check-in: " + checkIn);
        System.out.println("Check-out: " + checkOut);
        System.out.println("Nights: " + nights);
        System.out.printf("Total: $%.2f\n", total);

        System.out.print("\nConfirm booking? (yes/no): ");
        String confirm = scanner.nextLine();
        if (confirm.equalsIgnoreCase("yes")) {
            Booking booking = new Booking(generateBookingId(), property, currentUser, checkIn, checkOut, total);
            bookings.add(booking);
            System.out.println("Booking confirmed! Your booking ID is: " + booking.getId());
        } else {
            System.out.println("Booking cancelled.");
        }
    }

    private static int generateBookingId() {
        return bookings.size() + 1;
    }

    private static void viewMyBookings() {
        List<Booking> myBookings = bookings.stream()
                .filter(b -> b.getUser().equals(currentUser))
                .toList();

        if (myBookings.isEmpty()) {
            System.out.println("You have no bookings.");
            return;
        }

        System.out.println("\n--- Your Bookings ---");
        for (Booking b : myBookings) {
            System.out.printf("ID: %d | %s | %s to %s | $%.2f\n",
                    b.getId(), b.getProperty().getName(), b.getCheckIn(), b.getCheckOut(), b.getTotalPrice());
        }
    }

    // ==================== ADMIN FUNCTIONS ====================

    private static void addProperty() {
        System.out.println("\n--- Add New Property ---");
        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Location: ");
        String location = scanner.nextLine();
        System.out.print("Type (Villa/Apartment/Beachfront/Cabin): ");
        String type = scanner.nextLine();
        System.out.print("Price per night: ");
        double price = Double.parseDouble(scanner.nextLine());
        System.out.print("Bedrooms: ");
        int beds = Integer.parseInt(scanner.nextLine());
        System.out.print("Bathrooms: ");
        int baths = Integer.parseInt(scanner.nextLine());
        System.out.print("Max guests: ");
        int guests = Integer.parseInt(scanner.nextLine());
        System.out.print("Description: ");
        String desc = scanner.nextLine();

        Property p = new Property(name, location, type, price, beds, baths, guests, desc);
        properties.add(p);
        System.out.println("Property added successfully!");
    }

    private static void viewAllBookings() {
        if (bookings.isEmpty()) {
            System.out.println("No bookings yet.");
            return;
        }
        System.out.println("\n--- All Bookings ---");
        for (Booking b : bookings) {
            System.out.printf("ID: %d | %s booked by %s | %s to %s | $%.2f\n",
                    b.getId(), b.getProperty().getName(), b.getUser().getUsername(),
                    b.getCheckIn(), b.getCheckOut(), b.getTotalPrice());
        }
    }

    private static void viewAllUsers() {
        System.out.println("\n--- Registered Users ---");
        for (User u : users) {
            System.out.printf("%s | %s | %s\n", u.getUsername(), u.getEmail(), u.isAdmin() ? "Admin" : "Customer");
        }
    }

    // ==================== INITIALIZATION ====================

    private static void initializeSampleData() {
        // Sample users
        users.add(new User("admin", "admin123", "admin@vacationstays.com", true));
        users.add(new User("john", "pass", "john@email.com", false));
        users.add(new User("emma", "pass", "emma@email.com", false));

        // Sample properties (inspired by the web page)
        properties.add(new Property(
                "Luxury Beachfront Villa",
                "Maldives",
                "Villa",
                850.00,
                5, 4, 10,
                "Private pool, direct beach access, and stunning ocean views."
        ));
        properties.add(new Property(
                "Modern Downtown Apartment",
                "New York, USA",
                "Apartment",
                320.00,
                2, 2, 4,
                "Luxury high-rise apartment with skyline views."
        ));
        properties.add(new Property(
                "Cozy Mountain Cabin",
                "Swiss Alps",
                "Cabin",
                420.00,
                3, 2, 6,
                "Rustic cabin with fireplace and breathtaking mountain scenery."
        ));
        properties.add(new Property(
                "Seaside Escape",
                "Santorini, Greece",
                "Beachfront",
                650.00,
                3, 3, 6,
                "White-washed villa with caldera view and infinity pool."
        ));
        properties.add(new Property(
                "Tropical Paradise Villa",
                "Bali, Indonesia",
                "Villa",
                550.00,
                4, 3, 8,
                "Surrounded by lush gardens, private pool, and traditional Balinese architecture."
        ));
    }
}

// ==================== MODEL CLASSES ====================

class Property {
    private static int idCounter = 1;
    private int id;
    private String name;
    private String location;
    private String type; // Villa, Apartment, Beachfront, Cabin
    private double pricePerNight;
    private int bedrooms;
    private int bathrooms;
    private int maxGuests;
    private String description;

    public Property(String name, String location, String type, double pricePerNight,
                    int bedrooms, int bathrooms, int maxGuests, String description) {
        this.id = idCounter++;
        this.name = name;
        this.location = location;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.maxGuests = maxGuests;
        this.description = description;
    }

    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public String getType() { return type; }
    public double getPricePerNight() { return pricePerNight; }
    public int getBedrooms() { return bedrooms; }
    public int getBathrooms() { return bathrooms; }
    public int getMaxGuests() { return maxGuests; }
    public String getDescription() { return description; }
}

class User {
    private static int idCounter = 1;
    private int id;
    private String username;
    private String password; // In real app, never store plain text
    private String email;
    private boolean isAdmin;

    public User(String username, String password, String email, boolean isAdmin) {
        this.id = idCounter++;
        this.username = username;
        this.password = password;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public boolean isAdmin() { return isAdmin; }
}

class Booking {
    private int id;
    private Property property;
    private User user;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private double totalPrice;

    public Booking(int id, Property property, User user, LocalDate checkIn, LocalDate checkOut, double totalPrice) {
        this.id = id;
        this.property = property;
        this.user = user;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.totalPrice = totalPrice;
    }

    public int getId() { return id; }
    public Property getProperty() { return property; }
    public User getUser() { return user; }
    public LocalDate getCheckIn() { return checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public double getTotalPrice() { return totalPrice; }
}