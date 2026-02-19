// QHS Canteen Portal
// Role-based Student/Staff canteen system with local storage.

const STORAGE_KEYS = {
    users: "qhs_users",
    session: "qhs_session",
    orders: "qhs_orders",
    notifications: "qhs_notifications",
    menu: "qhs_menu",
    studentSuspensions: "qhs_student_suspensions",
    suggestions: "qhs_suggestions",
    theme: "qhs_theme",
    language: "qhs_language",
    fontSize: "qhs_font_size",
    notificationsEnabled: "qhs_notifications_enabled"
};

const REMOTE_STORAGE_KEYS = [
    STORAGE_KEYS.users,
    STORAGE_KEYS.orders,
    STORAGE_KEYS.notifications,
    STORAGE_KEYS.menu,
    STORAGE_KEYS.studentSuspensions,
    STORAGE_KEYS.suggestions
];

const API_CONFIG = {
    enabled: false
};

const ALLOWED_CATEGORIES = ["Drinks", "Food", "Snack", "Kakanin"];
const AVAILABILITY_VALUES = ["Available", "Out of Stock"];
const PAYMENT_METHODS = ["On-site", "GCash"];
const MENU_IMAGE_ZOOM_MIN = 1;
const MENU_IMAGE_ZOOM_MAX = 3;
const MENU_IMAGE_ZOOM_STEP = 0.25;
const MENU_IMAGE_MOTION_TILT_LIMIT = 35;
const MENU_IMAGE_MOTION_PAN_FACTOR = 2.2;
const MENU_IMAGE_MOTION_MAX_PAN = 140;
const REMOTE_SYNC_INTERVAL_MS = 4000;
const LANGUAGE_VALUES = ["en", "fil"];
const FONT_SIZE_VALUES = ["small", "medium", "large"];
const FONT_SIZE_PX = {
    small: 14,
    medium: 16,
    large: 18
};

const I18N = {
    en: {
        nav_dashboard: "Menu",
        nav_profile: "Profile",
        nav_orders: "History",
        nav_student_orders: "Student Reservations",
        nav_manage_menu: "Manage Menu",
        nav_suspensions: "Student Suspension",
        welcome: "Welcome",
        role_student: "Student",
        role_staff: "Staff",
        profile_title: "Profile",
        profile_subtitle: "View your account details.",
        settings_title: "Settings",
        settings_dark_mode: "Dark Mode",
        settings_notifications: "Notifications",
        settings_language: "Language",
        settings_font_size: "Font Size",
        settings_font_small: "Small",
        settings_font_medium: "Medium",
        settings_font_large: "Large",
        settings_password_title: "Change Password",
        settings_current_password: "Current Password",
        settings_new_password: "New Password",
        settings_confirm_password: "Confirm New Password",
        settings_password_submit: "Update Password",
        settings_current_password_placeholder: "Enter current password",
        settings_new_password_placeholder: "Minimum 6 characters",
        settings_confirm_password_placeholder: "Re-enter new password",
        settings_delete_account_title: "Delete Account",
        settings_delete_account_warning: "This action is permanent and cannot be undone.",
        settings_delete_current_password: "Current Password",
        settings_delete_current_password_placeholder: "Enter current password to confirm",
        settings_delete_account_submit: "Delete Account",
        settings_delete_account_confirm: "Are you sure you want to permanently delete your account?",
        password_current_required: "Current password is required.",
        password_new_required: "New password is required.",
        password_min_length: "New password must be at least 6 characters.",
        password_confirm_required: "Please confirm your new password.",
        password_mismatch: "New password and confirm password do not match.",
        password_same_as_current: "New password must be different from current password.",
        password_current_incorrect: "Current password is incorrect.",
        password_offline_unverified: "Current password could not be verified from this local account data.",
        password_updated: "Password updated successfully.",
        delete_current_required: "Current password is required to delete your account.",
        delete_current_incorrect: "Current password is incorrect.",
        delete_offline_unverified: "Current password could not be verified from this local account data.",
        delete_success: "Your account has been deleted.",
        orders_title_staff: "Student Reservations",
        orders_subtitle_staff: "View student orders, update status, and move hidden orders to history.",
        orders_title_student: "Reservation History",
        orders_subtitle_student: "Review meal name, quantity, date and status.",
        orders_pending_title: "Pending Reservations",
        orders_completed_title: "Completed Reservations",
        orders_no_matching: "No matching student reservations.",
        orders_no_student: "No student reservations yet",
        orders_no_pending_student: "No pending student reservations.",
        orders_no_completed_student: "No completed student reservations yet.",
        orders_student_list_title: "Pending Reservations",
        orders_staff_completed_title: "Completed Reservations",
        orders_history_staff_title: "History Orders",
        orders_no_active_staff: "No student orders to show.",
        orders_no_history_staff: "No history orders yet.",
        orders_search_label: "Search Student/Reserve/Date",
        orders_search_placeholder: "e.g. Juan, Sisig, 2026-02-17",
        orders_filter_label: "Filter List",
        orders_filter_all: "All",
        orders_filter_grade_section: "Grade and Section",
        orders_filter_complete: "Complete",
        orders_filter_pending: "Pending",
        orders_filter_completed: "Completed",
        orders_filter_onsite: "On-site",
        orders_filter_gcash: "GCash",
        orders_history_toggle_show: "Show History Orders",
        orders_history_toggle_hide: "Hide History Orders",
        orders_action_mark_completed: "Mark Completed",
        orders_action_hide: "Hide Order",
        orders_hide_requires_completed: "Only completed orders can be hidden.",
        orders_hidden_success: "Order moved to History Orders.",
        orders_no_orders: "No reservations yet",
        orders_no_pending: "No pending reservations.",
        orders_no_completed: "No completed reservations yet.",
        suspensions_title: "Student Suspension",
        suspensions_subtitle: "Suspend or unsuspend student accounts.",
        suspensions_empty: "No student accounts found.",
        suspensions_no_match: "No matching students found.",
        suspensions_status_active: "Active",
        suspensions_status_suspended: "Suspended",
        suspensions_search_label: "Search Student",
        suspensions_search_placeholder: "e.g. Juan, 123456789012, Grade 10",
        suspensions_group_suspended: "Suspended Students",
        suspensions_group_active: "Active Students",
        suspensions_group_empty_suspended: "No suspended students.",
        suspensions_group_empty_active: "No active students.",
        suspensions_reason_placeholder: "Reason for suspension (required)",
        suspensions_blocked_message: "Your account is suspended.",
        suspensions_reason_label: "Reason",
        suspensions_contact_staff: "Please contact staff.",
        suspensions_duration_label: "Duration",
        suspensions_duration_hours: "Hours",
        suspensions_duration_days: "Days",
        suspensions_no_duration: "Please enter a valid suspension duration.",
        suspensions_invalid_duration: "Suspension duration must be at least 1 hour or 1 day.",
        suspensions_action_adjust_duration: "Adjust Duration",
        suspensions_success_adjust_duration: "Suspension duration updated.",
        suspensions_expires_at: "Expires",
        suspensions_remaining: "Remaining",
        suspensions_remaining_expired: "Expired",
        suspensions_no_reason: "Please enter a suspension reason.",
        suspensions_action_suspend: "Suspend",
        suspensions_action_unsuspend: "Unsuspend",
        suspensions_action_show_settings: "View Suspension Settings",
        suspensions_action_hide_settings: "Hide Suspension Settings",
        suspensions_success_suspend: "Student account suspended.",
        suspensions_success_unsuspend: "Student account unsuspended.",
        suspensions_staff_only: "Only Staff can manage suspensions.",
        profile_full_name: "Full Name",
        profile_lrn: "LRN",
        profile_grade_section: "Grade and Section",
        profile_email: "Email",
        profile_role: "Role",
        staff_footer_text: "Staff Portal Footer: Manage reservations, menu updates, and records carefully."
    },
    fil: {
        nav_dashboard: "Menu",
        nav_profile: "Profile",
        nav_orders: "History",
        nav_student_orders: "Mga Reservation ng Students",
        nav_manage_menu: "Manage Menu",
        nav_suspensions: "Student Suspension",
        welcome: "Maligayang pagdating",
        role_student: "Estudyante",
        role_staff: "Staff",
        profile_title: "Profile",
        profile_subtitle: "Tingnan ang detalye ng iyong account.",
        settings_title: "Settings",
        settings_dark_mode: "Dark Mode",
        settings_notifications: "Mga Notification",
        settings_language: "Wika",
        settings_font_size: "Laki ng Font",
        settings_font_small: "Maliit",
        settings_font_medium: "Katamtaman",
        settings_font_large: "Malaki",
        settings_password_title: "Palitan ang Password",
        settings_current_password: "Kasalukuyang Password",
        settings_new_password: "Bagong Password",
        settings_confirm_password: "Kumpirmahin ang Bagong Password",
        settings_password_submit: "I-update ang Password",
        settings_current_password_placeholder: "Ilagay ang kasalukuyang password",
        settings_new_password_placeholder: "Hindi bababa sa 6 na character",
        settings_confirm_password_placeholder: "Ilagay muli ang bagong password",
        settings_delete_account_title: "Burahin ang Account",
        settings_delete_account_warning: "Permanenteng aksyon ito at hindi na maibabalik.",
        settings_delete_current_password: "Kasalukuyang Password",
        settings_delete_current_password_placeholder: "Ilagay ang kasalukuyang password para kumpirmahin",
        settings_delete_account_submit: "Burahin ang Account",
        settings_delete_account_confirm: "Sigurado ka bang gusto mong permanenteng burahin ang iyong account?",
        password_current_required: "Kailangan ang kasalukuyang password.",
        password_new_required: "Kailangan ang bagong password.",
        password_min_length: "Ang bagong password ay dapat hindi bababa sa 6 na character.",
        password_confirm_required: "Paki-kumpirma ang bagong password.",
        password_mismatch: "Hindi tugma ang bagong password at kumpirmasyon.",
        password_same_as_current: "Dapat iba ang bagong password sa kasalukuyang password.",
        password_current_incorrect: "Mali ang kasalukuyang password.",
        password_offline_unverified: "Hindi ma-verify ang kasalukuyang password mula sa local account data.",
        password_updated: "Matagumpay na na-update ang password.",
        delete_current_required: "Kailangan ang kasalukuyang password para mabura ang account.",
        delete_current_incorrect: "Mali ang kasalukuyang password.",
        delete_offline_unverified: "Hindi ma-verify ang kasalukuyang password mula sa local account data.",
        delete_success: "Nabura na ang iyong account.",
        orders_title_staff: "Mga Reservation ng Students",
        orders_subtitle_staff: "Tingnan ang student orders, i-update ang status, at ilipat sa history ang mga naka-hide.",
        orders_title_student: "Kasaysayan ng Reservation",
        orders_subtitle_student: "Suriin ang pangalan ng pagkain, dami, petsa at status.",
        orders_pending_title: "Mga Pending Reservation",
        orders_completed_title: "Mga Completed Reservation",
        orders_no_matching: "Walang tumugmang reservation ng students.",
        orders_no_student: "Wala pang reservation ng students",
        orders_no_pending_student: "Wala pang pending na reservation ng students.",
        orders_no_completed_student: "Wala pang completed na reservation ng students.",
        orders_student_list_title: "Mga Pending Reservation",
        orders_staff_completed_title: "Mga Completed Reservation",
        orders_history_staff_title: "History Orders",
        orders_no_active_staff: "Walang student orders na maipapakita.",
        orders_no_history_staff: "Wala pang history orders.",
        orders_search_label: "Hanapin Student/Reserve/Petsa",
        orders_search_placeholder: "hal. Juan, Sisig, 2026-02-17",
        orders_filter_label: "Filter List",
        orders_filter_all: "Lahat",
        orders_filter_grade_section: "Baitang at Seksyon",
        orders_filter_complete: "Complete",
        orders_filter_pending: "Pending",
        orders_filter_completed: "Completed",
        orders_filter_onsite: "On-site",
        orders_filter_gcash: "GCash",
        orders_history_toggle_show: "Ipakita ang History Orders",
        orders_history_toggle_hide: "Itago ang History Orders",
        orders_action_mark_completed: "Mark Completed",
        orders_action_hide: "I-hide ang Order",
        orders_hide_requires_completed: "Completed na order lang ang puwedeng i-hide.",
        orders_hidden_success: "Nailipat ang order sa History Orders.",
        orders_no_orders: "Wala pang reservation",
        orders_no_pending: "Wala pang pending na reservation.",
        orders_no_completed: "Wala pang completed na reservation.",
        suspensions_title: "Student Suspension",
        suspensions_subtitle: "I-suspend o i-unsuspend ang student accounts.",
        suspensions_empty: "Walang student account na nakita.",
        suspensions_no_match: "Walang student na tumugma sa hinanap.",
        suspensions_status_active: "Active",
        suspensions_status_suspended: "Suspended",
        suspensions_search_label: "Hanapin Student",
        suspensions_search_placeholder: "hal. Juan, 123456789012, Grade 10",
        suspensions_group_suspended: "Suspended na Students",
        suspensions_group_active: "Active na Students",
        suspensions_group_empty_suspended: "Walang suspended na students.",
        suspensions_group_empty_active: "Walang active na students.",
        suspensions_reason_placeholder: "Dahilan ng suspension (required)",
        suspensions_blocked_message: "Naka-suspend ang iyong account.",
        suspensions_reason_label: "Dahilan",
        suspensions_contact_staff: "Makipag-ugnayan sa staff.",
        suspensions_duration_label: "Tagal",
        suspensions_duration_hours: "Oras",
        suspensions_duration_days: "Araw",
        suspensions_no_duration: "Maglagay ng wastong tagal ng suspension.",
        suspensions_invalid_duration: "Ang suspension ay dapat hindi bababa sa 1 oras o 1 araw.",
        suspensions_action_adjust_duration: "Ayusin ang Tagal",
        suspensions_success_adjust_duration: "Na-update ang tagal ng suspension.",
        suspensions_expires_at: "Magtatapos",
        suspensions_remaining: "Natitira",
        suspensions_remaining_expired: "Expired",
        suspensions_no_reason: "Maglagay ng dahilan ng suspension.",
        suspensions_action_suspend: "Suspend",
        suspensions_action_unsuspend: "Unsuspend",
        suspensions_action_show_settings: "Ipakita ang Suspension Settings",
        suspensions_action_hide_settings: "Itago ang Suspension Settings",
        suspensions_success_suspend: "Na-suspend ang student account.",
        suspensions_success_unsuspend: "Na-unsuspend ang student account.",
        suspensions_staff_only: "Staff lang ang puwedeng mag-manage ng suspension.",
        profile_full_name: "Buong Pangalan",
        profile_lrn: "LRN",
        profile_grade_section: "Baitang at Seksyon",
        profile_email: "Email",
        profile_role: "Role",
        staff_footer_text: "Staff Portal Footer: Ingatang maigi ang pamamahala ng reservations, menu updates, at records."
    }
};

const DEFAULT_MENU = [
    { id: "delight", name: "Delight", category: "Drinks", price: 20, imageUrl: "", availability: "Available" },
    { id: "water", name: "Water", category: "Drinks", price: 10, imageUrl: "", availability: "Available" },
    { id: "mango-shake", name: "Mango Shake", category: "Drinks", price: 30, imageUrl: "", availability: "Available" },
    { id: "choco-shake", name: "Choco Shake", category: "Drinks", price: 30, imageUrl: "", availability: "Available" },
    { id: "dragon-fruit", name: "Dragon Fruit", category: "Drinks", price: 30, imageUrl: "", availability: "Available" },
    { id: "cucumber-juice", name: "Cucumber Juice", category: "Drinks", price: 20, imageUrl: "", availability: "Available" },
    { id: "bear-brand", name: "Bear Brand", category: "Drinks", price: 40, imageUrl: "", availability: "Available" },
    { id: "milo", name: "Milo", category: "Drinks", price: 40, imageUrl: "", availability: "Available" },
    { id: "selecta", name: "Selecta", category: "Drinks", price: 40, imageUrl: "", availability: "Available" },
    { id: "buko-juice", name: "Buko Juice", category: "Drinks", price: 20, imageUrl: "", availability: "Available" },
    { id: "chuckie", name: "Chuckie", category: "Drinks", price: 40, imageUrl: "", availability: "Available" },

    { id: "sisig", name: "Sisig", category: "Food", price: 60, imageUrl: "", availability: "Available" },
    { id: "pancit", name: "Pancit", category: "Food", price: 30, imageUrl: "", availability: "Available" },
    { id: "macaroni", name: "Macaroni", category: "Food", price: 30, imageUrl: "", availability: "Available" },
    { id: "palabok", name: "Palabok", category: "Food", price: 30, imageUrl: "", availability: "Available" },
    { id: "maha", name: "Maha", category: "Food", price: 20, imageUrl: "", availability: "Available" },
    { id: "creamy-steak", name: "Creamy Steak", category: "Food", price: 60, imageUrl: "", availability: "Available" },
    { id: "fried-chicken", name: "Fried Chicken", category: "Food", price: 30, imageUrl: "", availability: "Available" },
    { id: "corn-dog", name: "Corn Dog", category: "Food", price: 25, imageUrl: "", availability: "Available" },
    { id: "egg-with-rice", name: "Egg with Rice", category: "Food", price: 60, imageUrl: "", availability: "Available" },
    { id: "skinless-with-rice", name: "Skinless with Rice", category: "Food", price: 60, imageUrl: "", availability: "Available" },
    { id: "longanisa-with-rice", name: "Longanisa with Rice", category: "Food", price: 60, imageUrl: "", availability: "Available" },
    { id: "pizza", name: "Pizza", category: "Food", price: 25, imageUrl: "", availability: "Available" },
    { id: "siopao", name: "Siopao", category: "Food", price: 30, imageUrl: "", availability: "Available" },
    { id: "siomai", name: "Siomai", category: "Food", price: 20, imageUrl: "", availability: "Available" },
    { id: "pastil-with-rice", name: "Pastil with Rice", category: "Food", price: 55, imageUrl: "", availability: "Available" },

    { id: "banana-chips", name: "Banana Chips", category: "Snack", price: 15, imageUrl: "", availability: "Available" },
    { id: "kringkols", name: "Kringkols", category: "Snack", price: 20, imageUrl: "", availability: "Available" },
    { id: "eggnog", name: "Eggnog", category: "Snack", price: 10, imageUrl: "", availability: "Available" },
    { id: "breadstricks", name: "Breadstricks", category: "Snack", price: 1, imageUrl: "", availability: "Available" },
    { id: "mamon", name: "Mamon", category: "Snack", price: 2, imageUrl: "", availability: "Available" },
    { id: "lintiao", name: "Lintiao", category: "Snack", price: 20, imageUrl: "", availability: "Available" },
    { id: "egg-pie", name: "Egg Pie", category: "Snack", price: 20, imageUrl: "", availability: "Available" },
    { id: "turon", name: "Turon", category: "Snack", price: 20, imageUrl: "", availability: "Available" },
    { id: "egg-sandwich", name: "Egg Sandwich", category: "Snack", price: 20, imageUrl: "", availability: "Available" },

    { id: "pichi-pichi", name: "Pichi Pichi", category: "Kakanin", price: 20, imageUrl: "", availability: "Available" },
    { id: "kuchinta", name: "Kuchinta", category: "Kakanin", price: 20, imageUrl: "", availability: "Available" },
    { id: "palitaw", name: "Palitaw", category: "Kakanin", price: 20, imageUrl: "", availability: "Available" },
    { id: "biko", name: "Biko", category: "Kakanin", price: 2, imageUrl: "", availability: "Available" },
    { id: "sapin-sapin", name: "Sapin Sapin", category: "Kakanin", price: 20, imageUrl: "", availability: "Available" },
    { id: "suman", name: "Suman", category: "Kakanin", price: 20, imageUrl: "", availability: "Available" }
];

const MENU_IMAGE_BY_ID = {
    "delight": "pictures/Drink/Delight.jpg",
    "water": "pictures/Drink/Water.jpg",
    "mango-shake": "pictures/Drink/Mango Shake.jpg",
    "choco-shake": "pictures/Drink/Choco Shake.jpg",
    "dragon-fruit": "pictures/Drink/Dragon Fruit Shake.jpg",
    "cucumber-juice": "pictures/Drink/Cucumber Shake.jpg",
    "bear-brand": "pictures/Drink/Bear Brand.jpg",
    "milo": "pictures/Drink/Milo.jpg",
    "selecta": "pictures/Drink/Selecta.jpg",
    "buko-juice": "pictures/Drink/Buko Juice.jpg",
    "chuckie": "pictures/Drink/Chuckie.jpg",

    "sisig": "pictures/Food/Sisig.jpg",
    "pancit": "pictures/Food/Pancit.jpg",
    "macaroni": "pictures/Food/Macaroni.jpg",
    "palabok": "pictures/Food/Palabok.jpg",
    "maha": "pictures/Food/Maha.jpg",
    "creamy-steak": "pictures/Food/Creamy steak.jpg",
    "fried-chicken": "pictures/Food/Fried chicken.jpg",
    "corn-dog": "pictures/Food/Corn dog.jpg",
    "egg-with-rice": "pictures/Food/Egg with rice.jpg",
    "skinless-with-rice": "pictures/Food/Skinless with rice.jpg",
    "longanisa-with-rice": "pictures/Food/Longanisa with rice.jpg",
    "pizza": "pictures/Food/Pizza.jpg",
    "siopao": "pictures/Food/Siopao.jpg",
    "siomai": "pictures/Food/Siomai.jpg",
    "pastil-with-rice": "pictures/Food/Pastil with rice.jpg",

    "banana-chips": "pictures/Snack/Banana Chips.jpg",
    "kringkols": "pictures/Snack/Kringkols.jpg",
    "eggnog": "pictures/Snack/EggNog.jpg",
    "breadstricks": "pictures/Snack/Bread Sticks.jpg",
    "mamon": "pictures/Snack/Mamon.jpg",
    "lintiao": "pictures/Snack/Lintiao.jpg",
    "egg-pie": "pictures/Snack/Egg Pie.jpg",
    "turon": "pictures/Snack/Turon.jpg",
    "egg-sandwich": "pictures/Snack/Egg sandwich.jpg",

    "pichi-pichi": "pictures/Kakanin/Pichi pichi.jpg",
    "kuchinta": "pictures/Kakanin/Kuchinta.jpg",
    "palitaw": "pictures/Kakanin/Palitaw.jpg",
    "biko": "pictures/Kakanin/Biko.jpg",
    "sapin-sapin": "pictures/Kakanin/Sapin sapin.jpg",
    "suman": "pictures/Kakanin/Suman.jpg"
};

const MENU_DESCRIPTION_BY_ID = {
    "delight": "A sweet and refreshing yogurt drink with a smooth, creamy taste.",
    "water": "Clean and refreshing bottled drinking water.",
    "mango-shake": "A creamy blended drink made from ripe, sweet mangoes.",
    "choco-shake": "A rich and chocolatey blended drink, perfect for chocolate lovers.",
    "dragon-fruit": "A refreshing fruit drink with a mildly sweet and unique flavor.",
    "cucumber-juice": "A cool and light drink that refreshes and hydrates.",
    "bear-brand": "A nutritious powdered milk drink served warm or cold.",
    "milo": "A chocolate malt drink that gives energy and great taste.",
    "selecta": "Creamy and delicious flavored milk drink.",
    "buko-juice": "Fresh coconut water that is naturally sweet and refreshing.",
    "chuckie": "A ready-to-drink chocolate milk loved by kids and teens.",

    "sisig": "A flavorful and sizzling pork dish with a savory and slightly spicy taste.",
    "pancit": "Stir-fried noodles mixed with vegetables and meat.",
    "macaroni": "Creamy and slightly sweet macaroni salad with mixed ingredients.",
    "palabok": "Rice noodles topped with rich shrimp sauce, egg, and crunchy toppings.",
    "maha": "Creamy and sweet maja blanca made from coconut milk and corn.",
    "creamy-steak": "Tender beef steak cooked in a rich and creamy sauce.",
    "fried-chicken": "Crispy on the outside, juicy on the inside chicken meal.",
    "corn-dog": "Sausage coated in batter and deep-fried to golden perfection.",
    "egg-with-rice": "Simple and filling meal of fried egg served with rice.",
    "skinless-with-rice": "Juicy skinless sausage paired with steamed rice.",
    "longanisa-with-rice": "Sweet and savory Filipino sausage served with rice.",
    "pizza": "Baked flatbread topped with sauce, cheese, and delicious toppings.",
    "siopao": "Soft steamed bun filled with savory meat filling.",
    "siomai": "Steamed dumplings filled with seasoned meat and spices.",
    "pastil-with-rice": "Flavorful shredded chicken wrapped and served with rice.",

    "banana-chips": "Crunchy and sweet dried banana slices.",
    "kringkols": "Light and crispy bread snack with a slightly sweet taste.",
    "eggnog": "Sweet and crunchy bite-sized biscuits.",
    "breadstricks": "Crunchy baked bread snack, perfect for light munching.",
    "mamon": "Soft and fluffy sponge cake with a sweet flavor.",
    "lintiao": "Crispy rolled wafer snack with a sweet filling.",
    "egg-pie": "Creamy custard pie baked in a flaky crust.",
    "turon": "Fried banana spring roll coated with caramelized sugar.",
    "egg-sandwich": "Soft bread filled with creamy egg spread.",

    "pichi-pichi": "Soft and chewy cassava dessert topped with grated coconut.",
    "kuchinta": "Sticky brown rice cake topped with grated coconut.",
    "palitaw": "Soft rice cake coated with sugar and grated coconut.",
    "biko": "Sweet sticky rice cooked with coconut milk and brown sugar.",
    "sapin-sapin": "Colorful layered rice cake with sweet coconut flavor.",
    "suman": "Steamed sticky rice wrapped in banana leaves, lightly sweetened."
};

const NUTRITION_BY_CATEGORY = {
    Drinks: { calories: 110, protein: 2, carbs: 23, fat: 1 },
    Food: { calories: 360, protein: 16, carbs: 41, fat: 14 },
    Snack: { calories: 160, protein: 3, carbs: 26, fat: 5 },
    Kakanin: { calories: 190, protein: 3, carbs: 36, fat: 4 }
};

const state = {
    currentUser: null,
    activeSection: "dashboard",
    editingMenuId: "",
    staffHistoryVisible: false,
    cart: [],
    menuSearch: "",
    menuCategory: "all",
    suspensionsSearch: "",
    checkoutPaymentMethod: "On-site",
    gcashReference: "",
    language: "en",
    fontSize: "medium",
    notificationsEnabled: true
};

const i18n = (key, fallback = "") => {
    const language = LANGUAGE_VALUES.includes(state.language) ? state.language : "en";
    const selected = I18N[language] || I18N.en;
    return selected[key] || I18N.en[key] || fallback || key;
};

const ROLES = {
    student: "student",
    staff: "staff"
};

const elements = {
    authView: document.getElementById("auth-view"),
    appView: document.getElementById("app-view"),
    loadingOverlay: document.getElementById("app-loading-overlay"),
    loadingText: document.getElementById("app-loading-text"),

    authMessage: document.getElementById("auth-message"),
    systemMessage: document.getElementById("system-message"),
    orderMessage: document.getElementById("order-message"),
    profileMessage: document.getElementById("profile-message"),
    manageMenuMessage: document.getElementById("manage-menu-message"),
    suspensionsMessage: document.getElementById("suspensions-message"),
    suggestionMessage: document.getElementById("suggestion-message"),

    authTabButtons: Array.from(document.querySelectorAll(".auth-tab-btn")),
    loginForm: document.getElementById("login-form"),
    registerForm: document.getElementById("register-form"),
    registerRole: document.getElementById("reg-role"),
    registerIdGroup: document.getElementById("reg-id-group"),
    registerClassGroup: document.getElementById("reg-class-group"),
    registerIdNumber: document.getElementById("reg-id-number"),
    registerClassDepartment: document.getElementById("reg-class-dept"),

    welcomeText: document.getElementById("welcome-text"),
    navButtons: Array.from(document.querySelectorAll(".nav-btn[data-section]")),
    logoutBtn: document.getElementById("logout-btn"),

    sections: {
        dashboard: document.getElementById("dashboard-section"),
        profile: document.getElementById("profile-section"),
        orders: document.getElementById("orders-section"),
        "manage-menu": document.getElementById("manage-menu-section"),
        suspensions: document.getElementById("suspensions-section")
    },

    studentOrderPanel: document.getElementById("student-order-panel"),
    currentOrdersPanel: document.querySelector(".current-orders-panel"),
    staffOrderBlocked: document.getElementById("staff-order-blocked"),

    mealList: document.getElementById("meal-list"),
    menuSearchInput: document.getElementById("menu-search-input"),
    menuCategoryTabs: document.getElementById("menu-category-tabs"),
    orderForm: document.getElementById("order-form"),
    orderMeal: document.getElementById("order-meal"),
    orderQuantity: document.getElementById("order-quantity"),

    currentOrdersCount: document.getElementById("current-orders-count"),
    currentOrdersEmpty: document.getElementById("current-orders-empty"),
    currentOrdersList: document.getElementById("current-orders-list"),
    currentOrdersTotal: document.getElementById("current-orders-total"),
    currentPaymentMethod: document.getElementById("current-payment-method"),
    currentGcashQrPanel: document.getElementById("current-gcash-qr-panel"),
    currentGcashQrImage: document.getElementById("current-gcash-qr-image"),
    currentCheckoutBtn: document.getElementById("current-checkout-btn"),
    currentClearBtn: document.getElementById("current-clear-btn"),

    profileDisplay: document.getElementById("profile-display"),
    themeDarkToggle: document.getElementById("theme-dark-toggle"),
    profileSectionTitle: document.getElementById("profile-section-title"),
    profileSectionSubtitle: document.getElementById("profile-section-subtitle"),
    settingsTitle: document.getElementById("settings-title"),
    settingsDarkModeLabel: document.getElementById("settings-dark-mode-label"),
    settingsNotificationsLabel: document.getElementById("settings-notifications-label"),
    settingsNotificationsToggle: document.getElementById("settings-notifications-toggle"),
    settingsLanguageLabel: document.getElementById("settings-language-label"),
    settingsLanguageSelect: document.getElementById("settings-language-select"),
    settingsFontSizeLabel: document.getElementById("settings-font-size-label"),
    settingsFontSizeSelect: document.getElementById("settings-font-size-select"),
    settingsPasswordForm: document.getElementById("settings-password-form"),
    settingsPasswordTitle: document.getElementById("settings-password-title"),
    settingsCurrentPasswordLabel: document.getElementById("settings-current-password-label"),
    settingsCurrentPassword: document.getElementById("settings-current-password"),
    settingsNewPasswordLabel: document.getElementById("settings-new-password-label"),
    settingsNewPassword: document.getElementById("settings-new-password"),
    settingsConfirmPasswordLabel: document.getElementById("settings-confirm-password-label"),
    settingsConfirmPassword: document.getElementById("settings-confirm-password"),
    settingsPasswordSubmitBtn: document.getElementById("settings-password-submit-btn"),
    settingsDeleteAccountForm: document.getElementById("settings-delete-account-form"),
    settingsDeleteAccountTitle: document.getElementById("settings-delete-account-title"),
    settingsDeleteAccountWarning: document.getElementById("settings-delete-account-warning"),
    settingsDeleteCurrentPasswordLabel: document.getElementById("settings-delete-current-password-label"),
    settingsDeleteCurrentPassword: document.getElementById("settings-delete-current-password"),
    settingsDeleteAccountBtn: document.getElementById("settings-delete-account-btn"),
    editProfileBtn: document.getElementById("edit-profile-btn"),
    profileForm: document.getElementById("profile-form"),
    cancelProfileBtn: document.getElementById("cancel-profile-btn"),

    ordersEmpty: document.getElementById("orders-empty"),
    ordersList: document.getElementById("orders-list"),
    ordersCompletedEmpty: document.getElementById("orders-completed-empty"),
    ordersCompletedList: document.getElementById("orders-completed-list"),
    ordersHistoryEmpty: document.getElementById("orders-history-empty"),
    ordersHistoryList: document.getElementById("orders-history-list"),
    ordersTitle: document.getElementById("orders-title"),
    ordersSubtitle: document.getElementById("orders-subtitle"),
    staffOrdersTools: document.getElementById("staff-orders-tools"),
    staffOrdersSearchLabel: document.getElementById("staff-orders-search-label"),
    staffOrdersSearch: document.getElementById("staff-orders-search"),
    staffOrdersFilterLabel: document.getElementById("staff-orders-filter-label"),
    staffOrdersFilter: document.getElementById("staff-orders-filter"),
    staffHistoryToggleBtn: document.getElementById("staff-history-toggle-btn"),
    staffActiveTitle: document.getElementById("staff-active-title"),
    staffCompletedTitle: document.getElementById("staff-completed-title"),
    staffHistoryTitle: document.getElementById("staff-history-title"),

    manageMenuForm: document.getElementById("manage-menu-form"),
    menuEditId: document.getElementById("menu-edit-id"),
    menuItemName: document.getElementById("menu-item-name"),
    menuItemCategory: document.getElementById("menu-item-category"),
    menuCategoryList: document.getElementById("menu-category-list"),
    menuItemPrice: document.getElementById("menu-item-price"),
    menuItemImage: document.getElementById("menu-item-image"),
    menuItemNutrition: document.getElementById("menu-item-nutrition"),
    menuItemDescription: document.getElementById("menu-item-description"),
    menuSaveBtn: document.getElementById("menu-save-btn"),
    menuCancelEditBtn: document.getElementById("menu-cancel-edit-btn"),
    manageMenuList: document.getElementById("manage-menu-list"),
    suspensionsTitle: document.getElementById("suspensions-title"),
    suspensionsSubtitle: document.getElementById("suspensions-subtitle"),
    suspensionsSearchLabel: document.getElementById("suspensions-search-label"),
    suspensionsSearchInput: document.getElementById("suspensions-search"),
    suspensionsEmpty: document.getElementById("suspensions-empty"),
    suspensionsList: document.getElementById("suspensions-list"),

    itemInfoModal: document.getElementById("item-info-modal"),
    itemInfoModalTitle: document.getElementById("item-info-modal-title"),
    itemInfoModalContent: document.getElementById("item-info-modal-content"),
    itemInfoModalMessage: document.getElementById("item-info-modal-message"),
    itemInfoModalActions: document.getElementById("item-info-modal-actions"),
    itemInfoModalClose: document.getElementById("item-info-modal-close"),
    menuImageModal: document.getElementById("menu-image-modal"),
    menuImageTitle: document.getElementById("menu-image-title"),
    menuImagePreview: document.getElementById("menu-image-preview"),
    menuImageClose: document.getElementById("menu-image-close"),
    menuImageZoomOut: document.getElementById("menu-image-zoom-out"),
    menuImageZoomIn: document.getElementById("menu-image-zoom-in"),
    menuImageZoomReset: document.getElementById("menu-image-zoom-reset"),
    menuImageZoomLabel: document.getElementById("menu-image-zoom-label"),

    suggestionInput: document.getElementById("suggestion-input"),
    suggestionSubmitBtn: document.getElementById("suggestion-submit-btn"),
    staffFooterBanner: document.getElementById("staff-footer-banner"),
    staffFooterText: document.getElementById("staff-footer-text")
};

const ApiService = {
    isEnabled() {
        return API_CONFIG.enabled;
    },

    async request(payload) {
        if (!this.isEnabled()) return { ok: false, message: "Offline mode." };

        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify(payload)
            });

            const rawText = await response.text();
            let data = null;
            try {
                data = JSON.parse(rawText);
            } catch {
                const firstBrace = rawText.indexOf("{");
                const lastBrace = rawText.lastIndexOf("}");
                if (firstBrace >= 0 && lastBrace > firstBrace) {
                    try {
                        data = JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
                    } catch {
                        return { ok: false, message: "Invalid response." };
                    }
                } else {
                    return { ok: false, message: "Invalid response." };
                }
            }

            if (!response.ok) {
                return {
                    ok: false,
                    message: String(data?.message || `HTTP ${response.status}`)
                };
            }

            if (!data || typeof data !== "object") {
                return { ok: false, message: "Invalid response." };
            }

            return data;
        } catch {
            return { ok: false, message: "Network error." };
        }
    },

    async bootstrap() {
        return this.request({ action: "bootstrap" });
    },

    async save(key, value) {
        return this.request({
            action: "save",
            key,
            value
        });
    },

    async register(payload) {
        return this.request({
            action: "register",
            payload
        });
    },

    async login(payload) {
        return this.request({
            action: "login",
            payload
        });
    },

    async getSession() {
        return this.request({
            action: "session"
        });
    },

    async logout() {
        return this.request({
            action: "logout"
        });
    },

    async changePassword(payload) {
        return this.request({
            action: "change_password",
            payload
        });
    },

    async deleteAccount(payload) {
        return this.request({
            action: "delete_account",
            payload
        });
    }
};

const StorageService = {
    read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch {
            return fallback;
        }
    },

    write(key, value, options = {}) {
        localStorage.setItem(key, JSON.stringify(value));
        if (!options.skipRemote) {
            this.syncRemoteKey(key, value);
        }
    },

    shouldSyncRemotely(key) {
        return REMOTE_STORAGE_KEYS.includes(key);
    },

    syncRemoteKey(key, value) {
        if (!this.shouldSyncRemotely(key)) return;
        if (!ApiService.isEnabled()) return;
        void ApiService.save(key, value);
    },

    async bootstrapFromRemote() {
        if (!ApiService.isEnabled()) return;

        const result = await ApiService.bootstrap();
        if (!result.ok || !result.data || typeof result.data !== "object") return;

        const remoteData = result.data;
        for (const key of REMOTE_STORAGE_KEYS) {
            if (!Object.prototype.hasOwnProperty.call(remoteData, key)) continue;
            if (remoteData[key] === undefined || remoteData[key] === null) continue;
            this.write(key, remoteData[key], { skipRemote: true });
        }

        for (const key of REMOTE_STORAGE_KEYS) {
            if (Object.prototype.hasOwnProperty.call(remoteData, key)) continue;
            const fallback = key === STORAGE_KEYS.menu ? DEFAULT_MENU : [];
            const localValue = this.read(key, fallback);
            this.syncRemoteKey(key, localValue);
        }
    },

    getUsers() {
        const users = this.read(STORAGE_KEYS.users, []);
        if (!Array.isArray(users)) return [];

        let changed = false;
        const normalized = users.map((user) => {
            const normalizedRole = Helpers.normalizeRole(user?.role);
            const currentRole = String(user?.role || "");
            if (normalizedRole && currentRole !== normalizedRole) {
                changed = true;
                return { ...user, role: normalizedRole };
            }
            return user;
        });

        if (changed) {
            this.write(STORAGE_KEYS.users, normalized);
        }

        return normalized;
    },

    saveUsers(users) {
        const normalizedUsers = Array.isArray(users)
            ? users.map((user) => ({
                ...user,
                role: Helpers.normalizeRole(user?.role)
            }))
            : [];
        this.write(STORAGE_KEYS.users, normalizedUsers);
    },

    getSession() {
        let session = null;

        try {
            const raw = sessionStorage.getItem(STORAGE_KEYS.session);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    session = parsed;
                }
            }
        } catch {
            session = null;
        }

        if (session) return session;

        // Backward compatibility: migrate any old localStorage session to tab-scoped sessionStorage.
        const legacySession = this.read(STORAGE_KEYS.session, null);
        if (legacySession && typeof legacySession === "object") {
            try {
                sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(legacySession));
            } catch {
                // Ignore storage write failures and still return the legacy value.
            }
            try {
                localStorage.removeItem(STORAGE_KEYS.session);
            } catch {
                // Ignore cleanup failures.
            }
            return legacySession;
        }

        return null;
    },

    saveSession(session) {
        try {
            sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
        } catch {
            // Fallback for restrictive environments.
            this.write(STORAGE_KEYS.session, session);
            return;
        }

        try {
            localStorage.removeItem(STORAGE_KEYS.session);
        } catch {
            // Ignore cleanup failures.
        }
    },

    clearSession() {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.session);
        } catch {
            // Ignore storage failures.
        }
        localStorage.removeItem(STORAGE_KEYS.session);
    },

    getOrders() {
        return this.read(STORAGE_KEYS.orders, []);
    },

    saveOrders(orders) {
        this.write(STORAGE_KEYS.orders, orders);
    },

    getNotifications() {
        return this.read(STORAGE_KEYS.notifications, []);
    },

    saveNotifications(notifications) {
        this.write(STORAGE_KEYS.notifications, notifications);
    },

    getMenu() {
        return this.read(STORAGE_KEYS.menu, []);
    },

    saveMenu(menu) {
        this.write(STORAGE_KEYS.menu, menu);
    },

    getStudentSuspensions() {
        return this.read(STORAGE_KEYS.studentSuspensions, []);
    },

    saveStudentSuspensions(suspensions) {
        this.write(STORAGE_KEYS.studentSuspensions, suspensions);
    },

    ensureMenuSeeded() {
        const menu = this.getMenu();
        if (!Array.isArray(menu) || menu.length === 0) {
            this.saveMenu(DEFAULT_MENU.map((item) => MenuService.normalizeItem(item)));
            return;
        }

        const normalized = menu.map((item) => MenuService.normalizeItem(item));
        this.saveMenu(normalized);
    },

    getSuggestions() {
        return this.read(STORAGE_KEYS.suggestions, []);
    },

    saveSuggestions(suggestions) {
        this.write(STORAGE_KEYS.suggestions, suggestions);
    }
};

const ThemeService = {
    normalizeMode(mode) {
        return String(mode || "").toLowerCase() === "dark" ? "dark" : "light";
    },

    getStoredMode() {
        try {
            return this.normalizeMode(localStorage.getItem(STORAGE_KEYS.theme));
        } catch {
            return "light";
        }
    },

    apply(mode) {
        const nextMode = this.normalizeMode(mode);
        const isDark = nextMode === "dark";
        document.body.classList.toggle("theme-dark", isDark);
        if (elements.themeDarkToggle) {
            elements.themeDarkToggle.checked = isDark;
        }
    },

    set(mode) {
        const nextMode = this.normalizeMode(mode);
        try {
            localStorage.setItem(STORAGE_KEYS.theme, nextMode);
        } catch {
            // Ignore storage write failures and still apply theme for this session.
        }
        this.apply(nextMode);
    },

    init() {
        this.apply(this.getStoredMode());
    }
};

const PreferenceService = {
    normalizeLanguage(language) {
        const normalized = String(language || "").trim().toLowerCase();
        return LANGUAGE_VALUES.includes(normalized) ? normalized : "en";
    },

    normalizeFontSize(size) {
        const normalized = String(size || "").trim().toLowerCase();
        return FONT_SIZE_VALUES.includes(normalized) ? normalized : "medium";
    },

    normalizeNotificationsEnabled(value) {
        if (typeof value === "boolean") return value;
        const normalized = String(value ?? "").trim().toLowerCase();
        if (normalized === "false" || normalized === "0" || normalized === "off" || normalized === "no") {
            return false;
        }
        if (normalized === "true" || normalized === "1" || normalized === "on" || normalized === "yes") {
            return true;
        }
        return true;
    },

    getStoredLanguage() {
        try {
            return this.normalizeLanguage(localStorage.getItem(STORAGE_KEYS.language));
        } catch {
            return "en";
        }
    },

    getStoredFontSize() {
        try {
            return this.normalizeFontSize(localStorage.getItem(STORAGE_KEYS.fontSize));
        } catch {
            return "medium";
        }
    },

    getStoredNotificationsEnabled() {
        try {
            return this.normalizeNotificationsEnabled(localStorage.getItem(STORAGE_KEYS.notificationsEnabled));
        } catch {
            return true;
        }
    },

    applyLanguage(language) {
        const nextLanguage = this.normalizeLanguage(language);
        state.language = nextLanguage;
        document.documentElement.setAttribute("lang", nextLanguage);
        if (elements.settingsLanguageSelect) {
            elements.settingsLanguageSelect.value = nextLanguage;
        }
    },

    setLanguage(language) {
        const nextLanguage = this.normalizeLanguage(language);
        try {
            localStorage.setItem(STORAGE_KEYS.language, nextLanguage);
        } catch {
            // Ignore preference storage failures for this session.
        }
        this.applyLanguage(nextLanguage);
    },

    applyFontSize(size) {
        const nextSize = this.normalizeFontSize(size);
        state.fontSize = nextSize;
        if (elements.settingsFontSizeSelect) {
            elements.settingsFontSizeSelect.value = nextSize;
        }
        const px = FONT_SIZE_PX[nextSize] || FONT_SIZE_PX.medium;
        document.documentElement.style.fontSize = `${px}px`;
    },

    setFontSize(size) {
        const nextSize = this.normalizeFontSize(size);
        try {
            localStorage.setItem(STORAGE_KEYS.fontSize, nextSize);
        } catch {
            // Ignore preference storage failures for this session.
        }
        this.applyFontSize(nextSize);
    },

    applyNotifications(enabled) {
        const nextEnabled = this.normalizeNotificationsEnabled(enabled);
        state.notificationsEnabled = nextEnabled;
        if (elements.settingsNotificationsToggle) {
            elements.settingsNotificationsToggle.checked = nextEnabled;
        }
        if (!nextEnabled) {
            ToastService.clearAll();
        }
    },

    setNotifications(enabled) {
        const nextEnabled = this.normalizeNotificationsEnabled(enabled);
        try {
            localStorage.setItem(STORAGE_KEYS.notificationsEnabled, nextEnabled ? "true" : "false");
        } catch {
            // Ignore preference storage failures for this session.
        }
        this.applyNotifications(nextEnabled);
    },

    init() {
        this.applyLanguage(this.getStoredLanguage());
        this.applyFontSize(this.getStoredFontSize());
        this.applyNotifications(this.getStoredNotificationsEnabled());
    }
};

const ToastService = {
    container: null,
    recentMap: new Map(),

    init() {
        if (this.container || !document.body) return;
        const container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("aria-atomic", "false");
        document.body.appendChild(container);
        this.container = container;
    },

    cleanupRecent(now = Date.now()) {
        for (const [key, timestamp] of this.recentMap.entries()) {
            if (now - timestamp > 2500) {
                this.recentMap.delete(key);
            }
        }
    },

    shouldSuppress(type, message) {
        const now = Date.now();
        this.cleanupRecent(now);
        const key = `${type}:${message}`;
        const last = this.recentMap.get(key) || 0;
        if (now - last < 1500) return true;
        this.recentMap.set(key, now);
        return false;
    },

    removeToast(toast) {
        if (!toast || !toast.parentElement) return;
        toast.classList.remove("show");
        toast.classList.add("hide");
        window.setTimeout(() => {
            toast.remove();
        }, 220);
    },

    clearAll() {
        if (!this.container) return;
        this.recentMap.clear();
        for (const toast of Array.from(this.container.children)) {
            toast.remove();
        }
    },

    show(options = {}) {
        const message = String(options.message || "").trim();
        if (!message) return;

        const typeRaw = String(options.type || "info").toLowerCase();
        const type = ["success", "error", "info"].includes(typeRaw) ? typeRaw : "info";
        if (this.shouldSuppress(type, message)) return;

        this.init();
        if (!this.container) return;

        const titleFallback = type === "success"
            ? "Success"
            : (type === "error" ? "Error" : "Notice");
        const title = String(options.title || titleFallback).trim();
        const duration = Number.isFinite(Number(options.duration))
            ? Math.max(1800, Number(options.duration))
            : (type === "error" ? 5200 : 3800);

        const toast = document.createElement("article");
        toast.className = `toast toast-${type}`;
        toast.setAttribute("role", type === "error" ? "alert" : "status");

        toast.innerHTML = `
            <div class="toast-head">
                <strong class="toast-title">${Helpers.escapeHtml(title)}</strong>
                <button type="button" class="toast-close" aria-label="Close notification">x</button>
            </div>
            <p class="toast-message">${Helpers.escapeHtml(message)}</p>
            <div class="toast-progress" style="--toast-duration:${Math.round(duration)}ms"></div>
        `;

        const closeBtn = toast.querySelector(".toast-close");
        closeBtn?.addEventListener("click", () => this.removeToast(toast));

        this.container.appendChild(toast);
        while (this.container.children.length > 4) {
            this.container.firstElementChild?.remove();
        }

        window.requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        window.setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }
};

const Helpers = {
    normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    },

    normalizeRole(role) {
        const raw = String(role || "").trim().toLowerCase();
        if (raw === ROLES.student) return ROLES.student;
        if (raw === ROLES.staff) return ROLES.staff;
        if (raw === "student") return ROLES.student;
        if (raw === "staff") return ROLES.staff;
        return "";
    },

    createId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    },

    formatDateTime(isoDate) {
        return new Date(isoDate).toLocaleString();
    },

    formatPrice(value) {
        return `P ${Number(value || 0).toFixed(2)}`;
    },

    setMessage(element, text, type = "", options = {}) {
        if (!element) return;
        const nextText = String(text || "");
        const normalizedType = type === "success" || type === "error" ? type : "";

        element.textContent = nextText;
        element.classList.remove("success", "error");
        if (normalizedType) element.classList.add(normalizedType);

        if (!nextText) {
            delete element.dataset.lastToastText;
            delete element.dataset.lastToastType;
            return;
        }

        const wantsToast = options.toast === true || (options.toast !== false && Boolean(normalizedType));
        if (!wantsToast) return;
        if (!state.notificationsEnabled) return;

        const shouldForceToast = options.toastForce === true;
        if (!shouldForceToast && (
            element.dataset.lastToastText === nextText
            && element.dataset.lastToastType === normalizedType
        )) {
            return;
        }

        element.dataset.lastToastText = nextText;
        element.dataset.lastToastType = normalizedType;

        ToastService.show({
            type: normalizedType || "info",
            title: options.toastTitle || "",
            message: nextText,
            duration: options.toastDuration
        });
    },

    clearMessages() {
        this.setMessage(elements.authMessage, "");
        this.setMessage(elements.systemMessage, "");
        this.setMessage(elements.orderMessage, "");
        this.setMessage(elements.profileMessage, "");
        this.setMessage(elements.manageMenuMessage, "");
        this.setMessage(elements.suspensionsMessage, "");
        this.setMessage(elements.suggestionMessage, "");
    },

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    },

    safeImageUrl(url) {
        const trimmed = String(url || "").trim();
        if (!trimmed) return "";

        const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
        if (!hasExplicitScheme) {
            return trimmed;
        }

        try {
            const parsed = new URL(trimmed, window.location.href);
            return ["http:", "https:", "data:"].includes(parsed.protocol) ? trimmed : "";
        } catch {
            return "";
        }
    },

    parsePrice(value) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value >= 0 ? value : 0;
        }

        const raw = String(value ?? "").trim();
        if (!raw) return 0;
        const numeric = raw.replace(/[^0-9.]/g, "");
        const parsed = Number.parseFloat(numeric);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    },

    normalizeCategory(value) {
        const compact = String(value || "").trim().replace(/\s+/g, " ");
        if (!compact) return "";

        const raw = compact.toLowerCase();
        if (raw === "snacks" || raw === "snack") return "Snack";
        if (raw === "drink" || raw === "drinks") return "Drinks";
        if (raw === "food" || raw === "foods") return "Food";
        if (raw === "kakanin") return "Kakanin";

        return compact
            .split(" ")
            .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : ""))
            .join(" ");
    },

    categoryKey(value) {
        const key = String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        if (key === "snacks") return "snack";
        return key;
    },

    normalizeAvailability(value) {
        const raw = String(value || "").trim().toLowerCase();
        if (raw === "available" || raw === "in stock") return "Available";
        if (raw === "out of stock" || raw === "unavailable") return "Out of Stock";
        return "Available";
    },

    nutritionLabel(item) {
        if (item.nutrition) return item.nutrition;

        const baseline = NUTRITION_BY_CATEGORY[item.category] || NUTRITION_BY_CATEGORY.Food;
        const factor = Math.min(1.8, Math.max(0.6, Number(item.price || 0) / 30 || 1));
        const calories = Math.round(baseline.calories * factor);
        const protein = Math.max(1, Math.round(baseline.protein * factor));
        const carbs = Math.max(1, Math.round(baseline.carbs * factor));
        const fat = Math.max(1, Math.round(baseline.fat * factor));
        return `${calories} kcal | P ${protein}g | C ${carbs}g | F ${fat}g`;
    },

    normalizePaymentMethod(value) {
        const raw = String(value || "").trim().toLowerCase();
        const isKnown = PAYMENT_METHODS.some((method) => method.toLowerCase() === raw);
        if (!isKnown) return "On-site";
        return raw === "gcash" ? "GCash" : "On-site";
    }
};

const RoleGuard = {
    isLoggedIn() {
        return Boolean(state.currentUser);
    },

    isStudent() {
        return Helpers.normalizeRole(state.currentUser?.role) === ROLES.student;
    },

    isStaff() {
        return Helpers.normalizeRole(state.currentUser?.role) === ROLES.staff;
    },

    defaultSection() {
        return this.isStaff() ? "orders" : "dashboard";
    },

    canAccessSection(section) {
        if (!this.isLoggedIn()) return false;
        if (this.isStaff()) return ["dashboard", "profile", "orders", "manage-menu", "suspensions"].includes(section);
        return ["dashboard", "profile", "orders"].includes(section);
    },

    restrictedMessage(section) {
        if (section === "manage-menu") return "Student accounts are not allowed to manage menu items.";
        if (section === "suspensions") return i18n("suspensions_staff_only", "Only Staff can manage suspensions.");
        return "You are not authorized to access this section.";
    }
};

const ValidationService = {
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
    },

    validateRegistration(payload) {
        const normalizedRole = Helpers.normalizeRole(payload.role);
        if (!payload.fullName.trim()) return "Full Name is required.";
        if (![ROLES.student, ROLES.staff].includes(normalizedRole)) return "Please choose Student or Staff.";
        if (normalizedRole === ROLES.student && !payload.idNumber.trim()) return "LRN is required.";
        if (normalizedRole === ROLES.student && !payload.classDepartment.trim()) return "Grade and Section is required.";
        if (!this.isValidEmail(payload.email)) return "Enter a valid email address.";
        if (!String(payload.password || "")) return "Password is required.";
        if (String(payload.password || "").length < 6) return "Password must be at least 6 characters.";
        if (!String(payload.confirmPassword || "")) return "Please confirm your password.";
        if (String(payload.password || "") !== String(payload.confirmPassword || "")) {
            return "Password and confirm password do not match.";
        }
        return "";
    },

    validateLogin(payload) {
        if (!this.isValidEmail(payload.email)) return "Enter a valid email address.";
        if (!payload.password) return "Password is required.";
        if (![ROLES.student, ROLES.staff].includes(Helpers.normalizeRole(payload.role))) return "Select Student or Staff.";
        return "";
    },

    validateProfile(payload) {
        if (!payload.fullName.trim()) return "Full Name is required.";
        if (!payload.idNumber.trim()) return "LRN is required.";
        if (!payload.classDepartment.trim()) return "Grade and Section is required.";
        if (!this.isValidEmail(payload.email)) return "Enter a valid email address.";
        return "";
    },

    validatePasswordChange(payload) {
        if (!String(payload.currentPassword || "")) return i18n("password_current_required", "Current password is required.");
        if (!String(payload.newPassword || "")) return i18n("password_new_required", "New password is required.");
        if (String(payload.newPassword || "").length < 6) return i18n("password_min_length", "New password must be at least 6 characters.");
        if (!String(payload.confirmPassword || "")) return i18n("password_confirm_required", "Please confirm your new password.");
        if (String(payload.newPassword) !== String(payload.confirmPassword)) return i18n("password_mismatch", "New password and confirm password do not match.");
        if (String(payload.currentPassword) === String(payload.newPassword)) return i18n("password_same_as_current", "New password must be different from current password.");
        return "";
    },

    validateDeleteAccount(payload) {
        if (!String(payload.currentPassword || "")) {
            return i18n("delete_current_required", "Current password is required to delete your account.");
        }
        return "";
    },

    validateOrder(payload) {
        if (!payload.mealId) return "Please choose a meal.";
        if (!Number.isInteger(payload.quantity) || payload.quantity < 1) return "Quantity must be at least 1.";
        return "";
    },

    validateMenuItem(payload) {
        if (!payload.name.trim()) return "Item name is required.";
        const category = String(payload.category || "").trim();
        if (!category) return "Category is required.";
        if (category.length > 40) return "Category must be 40 characters or less.";
        if (!Number.isFinite(payload.price) || payload.price < 0) return "Price must be a valid number.";
        if (!AVAILABILITY_VALUES.includes(payload.availability)) return "Choose a valid availability status.";
        if (payload.imageUrl && !Helpers.safeImageUrl(payload.imageUrl)) return "Image must be a valid URL or local path.";
        if (payload.nutrition && payload.nutrition.length > 120) return "Nutrition text is too long.";
        if (payload.description && payload.description.length > 300) return "Description text is too long.";
        return "";
    }
};

const AuthService = {
    normalizeUser(rawUser) {
        const normalizedRole = Helpers.normalizeRole(rawUser?.role);
        return {
            id: String(rawUser?.id || Helpers.createId("usr")),
            fullName: String(rawUser?.fullName || "").trim(),
            idNumber: String(rawUser?.idNumber || "").trim(),
            classDepartment: String(rawUser?.classDepartment || "").trim(),
            email: Helpers.normalizeEmail(rawUser?.email || ""),
            role: normalizedRole || ROLES.student,
            createdAt: String(rawUser?.createdAt || new Date().toISOString())
        };
    },

    upsertLocalUser(user, plainPassword = "") {
        const users = StorageService.getUsers();
        const targetIndex = users.findIndex(
            (entry) =>
                String(entry?.id || "") === user.id
                || Helpers.normalizeEmail(entry?.email || "") === user.email
        );

        const merged = {
            ...(targetIndex >= 0 ? users[targetIndex] : {}),
            ...user
        };

        if (plainPassword) {
            merged.password = plainPassword;
        }

        if (targetIndex >= 0) {
            users[targetIndex] = merged;
        } else {
            users.push(merged);
        }

        StorageService.saveUsers(users);
    },

    shouldFallbackToLocalAuth(apiResult) {
        return !apiResult?.ok;
    },

    registerLocal(normalizedPayload) {
        const users = StorageService.getUsers();
        const existing = users.find((user) => Helpers.normalizeEmail(user.email) === normalizedPayload.email);
        if (existing) return { ok: false, message: "Email is already registered." };

        const newUser = {
            id: Helpers.createId("usr"),
            fullName: normalizedPayload.fullName,
            idNumber: normalizedPayload.idNumber,
            classDepartment: normalizedPayload.classDepartment,
            email: normalizedPayload.email,
            password: normalizedPayload.password,
            role: normalizedPayload.role,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        StorageService.saveUsers(users);
        StorageService.saveSession({ userId: newUser.id });
        state.currentUser = newUser;
        return { ok: true, user: newUser };
    },

    loginLocal(normalizedPayload) {
        const users = StorageService.getUsers();
        const matchedUser = users.find(
            (user) =>
                Helpers.normalizeEmail(user.email) === normalizedPayload.email &&
                user.password === normalizedPayload.password &&
                Helpers.normalizeRole(user.role) === normalizedPayload.role
        );

        if (!matchedUser) return { ok: false, message: "Invalid email/password for the selected role." };
        if (Helpers.normalizeRole(matchedUser.role) === ROLES.student && SuspensionService.isSuspended(matchedUser.id)) {
            return { ok: false, message: SuspensionService.getSuspensionMessage(matchedUser.id) };
        }

        StorageService.saveSession({ userId: matchedUser.id });
        state.currentUser = matchedUser;
        return { ok: true, user: matchedUser };
    },

    restoreLocalSession() {
        const session = StorageService.getSession();
        if (!session?.userId) return null;

        const users = StorageService.getUsers();
        const user = users.find((entry) => entry.id === session.userId);
        if (!user) {
            StorageService.clearSession();
            return null;
        }
        if (Helpers.normalizeRole(user.role) === ROLES.student && SuspensionService.isSuspended(user.id)) {
            StorageService.clearSession();
            return null;
        }

        state.currentUser = user;
        return user;
    },

    async register(payload) {
        const validationError = ValidationService.validateRegistration(payload);
        if (validationError) return { ok: false, message: validationError };

        const normalizedPayload = {
            fullName: String(payload.fullName || "").trim(),
            idNumber: String(payload.idNumber || "").trim(),
            classDepartment: String(payload.classDepartment || "").trim(),
            email: Helpers.normalizeEmail(payload.email),
            password: String(payload.password || ""),
            role: Helpers.normalizeRole(payload.role)
        };

        if (ApiService.isEnabled()) {
            const result = await ApiService.register(normalizedPayload);
            if (result.ok && result.user) {
                const user = this.normalizeUser(result.user);
                this.upsertLocalUser(user, normalizedPayload.password);
                StorageService.saveSession({ userId: user.id });
                state.currentUser = user;
                return { ok: true, user };
            }

            if (!this.shouldFallbackToLocalAuth(result)) {
                return { ok: false, message: String(result.message || "Registration failed.") };
            }
        }

        return this.registerLocal(normalizedPayload);
    },

    async login(payload) {
        const validationError = ValidationService.validateLogin(payload);
        if (validationError) return { ok: false, message: validationError };

        const normalizedPayload = {
            email: Helpers.normalizeEmail(payload.email),
            password: String(payload.password || ""),
            role: Helpers.normalizeRole(payload.role)
        };

        if (ApiService.isEnabled()) {
            const result = await ApiService.login(normalizedPayload);
            if (result.ok && result.user) {
                const user = this.normalizeUser(result.user);
                this.upsertLocalUser(user, normalizedPayload.password);
                StorageService.saveSession({ userId: user.id });
                state.currentUser = user;
                return { ok: true, user };
            }

            if (!this.shouldFallbackToLocalAuth(result)) {
                return { ok: false, message: String(result.message || "Login failed.") };
            }
        }

        return this.loginLocal(normalizedPayload);
    },

    async restoreSession() {
        if (ApiService.isEnabled()) {
            const result = await ApiService.getSession();
            if (result.ok && result.authenticated && result.user) {
                const user = this.normalizeUser(result.user);
                this.upsertLocalUser(user);
                StorageService.saveSession({ userId: user.id });
                state.currentUser = user;
                return user;
            }

            if (result.ok && result.authenticated === false) {
                StorageService.clearSession();
                return null;
            }

            if (this.shouldFallbackToLocalAuth(result)) {
                return this.restoreLocalSession();
            }

            StorageService.clearSession();
            return null;
        }

        return this.restoreLocalSession();
    },

    async logout() {
        if (ApiService.isEnabled()) {
            const result = await ApiService.logout();
            if (!result.ok && !this.shouldFallbackToLocalAuth(result)) {
                return { ok: false, message: String(result.message || "Logout failed.") };
            }
        }

        state.currentUser = null;
        state.cart = [];
        state.editingMenuId = "";
        StorageService.clearSession();
        return { ok: true };
    },

    updateLocalPassword(userId, nextPassword) {
        const users = StorageService.getUsers();
        const targetIndex = users.findIndex((user) => String(user?.id || "") === String(userId || ""));
        if (targetIndex >= 0) {
            users[targetIndex] = {
                ...users[targetIndex],
                password: String(nextPassword || "")
            };
            StorageService.saveUsers(users);
        }
    },

    removeLocalUserData(userId) {
        const targetUserId = String(userId || "").trim();
        if (!targetUserId) return;

        const users = StorageService.getUsers().filter((user) => String(user?.id || "").trim() !== targetUserId);
        StorageService.saveUsers(users);

        const nextOrders = OrderService.getAll().filter((order) => String(order?.userId || "").trim() !== targetUserId);
        StorageService.saveOrders(nextOrders);

        const nextSuggestions = StorageService.getSuggestions().filter((entry) => String(entry?.userId || "").trim() !== targetUserId);
        StorageService.saveSuggestions(nextSuggestions);

        const nextNotifications = StorageService.getNotifications()
            .filter((entry) => {
                const senderId = String(entry?.senderId || "").trim();
                const receiverId = String(entry?.receiverId || "").trim();
                return senderId !== targetUserId && receiverId !== targetUserId;
            })
            .map((entry) => {
                const readByStaffIds = Array.isArray(entry?.readByStaffIds)
                    ? entry.readByStaffIds.filter((id) => String(id || "").trim() !== targetUserId)
                    : [];
                return {
                    ...entry,
                    readByStaffIds
                };
            });
        StorageService.saveNotifications(nextNotifications);

        const nextSuspensions = StorageService.getStudentSuspensions().filter((entry) => {
            const rawUserId = String(entry?.userId || entry?.id || "").trim();
            const normalizedUserId = rawUserId.startsWith("sus-") ? rawUserId.slice(4) : rawUserId;
            return normalizedUserId !== targetUserId;
        });
        StorageService.saveStudentSuspensions(nextSuspensions);
    },

    clearClientSessionState() {
        state.currentUser = null;
        state.cart = [];
        state.editingMenuId = "";
        StorageService.clearSession();
    },

    changePasswordLocal(payload) {
        if (!state.currentUser?.id) {
            return { ok: false, message: "Login is required." };
        }

        const users = StorageService.getUsers();
        const targetIndex = users.findIndex((user) => user.id === state.currentUser.id);
        if (targetIndex < 0) {
            return { ok: false, message: "User account not found." };
        }

        const currentStoredPassword = String(users[targetIndex]?.password || "");
        if (!currentStoredPassword) {
            return { ok: false, message: i18n("password_offline_unverified", "Current password could not be verified from this local account data.") };
        }
        if (currentStoredPassword !== payload.currentPassword) {
            return { ok: false, message: i18n("password_current_incorrect", "Current password is incorrect.") };
        }

        users[targetIndex] = {
            ...users[targetIndex],
            password: payload.newPassword
        };
        StorageService.saveUsers(users);
        return { ok: true };
    },

    async changePassword(payload) {
        if (!RoleGuard.isLoggedIn()) {
            return { ok: false, message: "Login is required." };
        }

        const validationError = ValidationService.validatePasswordChange(payload);
        if (validationError) return { ok: false, message: validationError };

        const normalizedPayload = {
            currentPassword: String(payload.currentPassword || ""),
            newPassword: String(payload.newPassword || ""),
            confirmPassword: String(payload.confirmPassword || "")
        };

        if (ApiService.isEnabled()) {
            const result = await ApiService.changePassword(normalizedPayload);
            if (result.ok) {
                this.updateLocalPassword(state.currentUser.id, normalizedPayload.newPassword);
                return {
                    ok: true,
                    message: String(result.message || i18n("password_updated", "Password updated successfully."))
                };
            }

            if (!this.shouldFallbackToLocalAuth(result)) {
                return { ok: false, message: String(result.message || "Failed to change password.") };
            }
        }

        const fallbackResult = this.changePasswordLocal(normalizedPayload);
        if (fallbackResult.ok) {
            return {
                ok: true,
                message: i18n("password_updated", "Password updated successfully.")
            };
        }
        return fallbackResult;
    },

    deleteAccountLocal(payload) {
        if (!state.currentUser?.id) {
            return { ok: false, message: "Login is required." };
        }

        const users = StorageService.getUsers();
        const targetIndex = users.findIndex((user) => user.id === state.currentUser.id);
        if (targetIndex < 0) {
            return { ok: false, message: "User account not found." };
        }

        const currentStoredPassword = String(users[targetIndex]?.password || "");
        if (!currentStoredPassword) {
            return {
                ok: false,
                message: i18n(
                    "delete_offline_unverified",
                    "Current password could not be verified from this local account data."
                )
            };
        }
        if (currentStoredPassword !== payload.currentPassword) {
            return {
                ok: false,
                message: i18n("delete_current_incorrect", "Current password is incorrect.")
            };
        }

        const userId = String(state.currentUser.id || "");
        this.removeLocalUserData(userId);
        this.clearClientSessionState();
        return {
            ok: true,
            message: i18n("delete_success", "Your account has been deleted.")
        };
    },

    async deleteAccount(payload) {
        if (!RoleGuard.isLoggedIn()) {
            return { ok: false, message: "Login is required." };
        }

        const validationError = ValidationService.validateDeleteAccount(payload);
        if (validationError) return { ok: false, message: validationError };

        const normalizedPayload = {
            currentPassword: String(payload.currentPassword || "")
        };
        const targetUserId = String(state.currentUser?.id || "");

        if (ApiService.isEnabled()) {
            const result = await ApiService.deleteAccount(normalizedPayload);
            if (result.ok) {
                this.removeLocalUserData(targetUserId);
                this.clearClientSessionState();
                return {
                    ok: true,
                    message: String(result.message || i18n("delete_success", "Your account has been deleted."))
                };
            }

            if (!this.shouldFallbackToLocalAuth(result)) {
                return { ok: false, message: String(result.message || "Failed to delete account.") };
            }
        }

        return this.deleteAccountLocal(normalizedPayload);
    }
};

const ProfileService = {
    updateProfile(payload) {
        if (!RoleGuard.isLoggedIn()) return { ok: false, message: "Login is required." };

        const validationError = ValidationService.validateProfile(payload);
        if (validationError) return { ok: false, message: validationError };

        const users = StorageService.getUsers();
        const userIndex = users.findIndex((user) => user.id === state.currentUser.id);
        if (userIndex < 0) return { ok: false, message: "User account not found." };

        const normalizedEmail = Helpers.normalizeEmail(payload.email);
        const duplicateEmail = users.some((user, index) => index !== userIndex && Helpers.normalizeEmail(user.email) === normalizedEmail);
        if (duplicateEmail) return { ok: false, message: "Email is already used by another account." };

        const updatedUser = {
            ...users[userIndex],
            fullName: payload.fullName.trim(),
            idNumber: payload.idNumber.trim(),
            classDepartment: payload.classDepartment.trim(),
            email: normalizedEmail
        };

        users[userIndex] = updatedUser;
        StorageService.saveUsers(users);
        state.currentUser = updatedUser;
        return { ok: true, user: updatedUser };
    }
};

const MenuService = {
    normalizeItem(rawItem) {
        const id = String(rawItem?.id || Helpers.createId("meal"));
        const name = String(rawItem?.name || "").trim() || "Unnamed Item";
        const normalizedCategory = Helpers.normalizeCategory(rawItem?.category);
        const category = normalizedCategory || "Food";
        const price = Helpers.parsePrice(rawItem?.price);
        const suppliedImage = Helpers.safeImageUrl(rawItem?.imageUrl || rawItem?.image || "");
        const defaultImage = Helpers.safeImageUrl(MENU_IMAGE_BY_ID[id] || "");
        const imageUrl = suppliedImage || defaultImage;
        const normalizedAvailability = Helpers.normalizeAvailability(rawItem?.availability);
        const availability = AVAILABILITY_VALUES.includes(normalizedAvailability) ? normalizedAvailability : "Available";
        const nutrition = String(rawItem?.nutrition || "").trim();
        const suppliedDescription = String(rawItem?.description || "").trim();
        const defaultDescription = String(MENU_DESCRIPTION_BY_ID[id] || "").trim();
        const description = suppliedDescription || defaultDescription;

        return {
            id,
            name,
            category,
            price,
            imageUrl,
            availability,
            nutrition,
            description
        };
    },

    getMenu() {
        const rawMenu = StorageService.getMenu();
        if (!Array.isArray(rawMenu)) return [];
        return rawMenu.map((item) => this.normalizeItem(item));
    },

    saveMenu(menu) {
        StorageService.saveMenu(menu.map((item) => this.normalizeItem(item)));
    },

    getById(id) {
        return this.getMenu().find((item) => item.id === id) || null;
    },

    getCategories(menuItems = null) {
        const source = Array.isArray(menuItems) ? menuItems : this.getMenu();
        const seen = new Set(ALLOWED_CATEGORIES);

        for (const item of source) {
            const normalized = Helpers.normalizeCategory(item?.category);
            if (normalized) seen.add(normalized);
        }

        const defaults = ALLOWED_CATEGORIES.filter((category) => seen.has(category));
        const extras = Array.from(seen)
            .filter((category) => !ALLOWED_CATEGORIES.includes(category))
            .sort((a, b) => a.localeCompare(b));

        return [...defaults, ...extras];
    },

    createSlug(name) {
        const base = String(name || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return base || Helpers.createId("meal");
    },

    ensureUniqueId(candidateId, menu) {
        let nextId = candidateId;
        let counter = 1;
        const ids = new Set(menu.map((item) => item.id));
        while (ids.has(nextId)) {
            nextId = `${candidateId}-${counter}`;
            counter += 1;
        }
        return nextId;
    },

    add(payload) {
        const validationError = ValidationService.validateMenuItem(payload);
        if (validationError) return { ok: false, message: validationError };

        const menu = this.getMenu();
        const baseId = this.createSlug(payload.name);
        const id = this.ensureUniqueId(baseId, menu);

        const nextItem = this.normalizeItem({
            id,
            name: payload.name,
            category: payload.category,
            price: payload.price,
            imageUrl: payload.imageUrl,
            availability: payload.availability,
            nutrition: payload.nutrition,
            description: payload.description
        });

        menu.push(nextItem);
        this.saveMenu(menu);
        return { ok: true, item: nextItem };
    },

    update(id, payload) {
        const validationError = ValidationService.validateMenuItem(payload);
        if (validationError) return { ok: false, message: validationError };

        const menu = this.getMenu();
        const targetIndex = menu.findIndex((item) => item.id === id);
        if (targetIndex < 0) return { ok: false, message: "Menu item not found." };

        const updated = this.normalizeItem({
            ...menu[targetIndex],
            ...payload,
            id
        });

        menu[targetIndex] = updated;
        this.saveMenu(menu);
        return { ok: true, item: updated };
    },

    remove(id) {
        const menu = this.getMenu();
        const nextMenu = menu.filter((item) => item.id !== id);
        if (nextMenu.length === menu.length) return { ok: false, message: "Menu item not found." };

        this.saveMenu(nextMenu);
        return { ok: true };
    },

    toggleAvailability(id) {
        const item = this.getById(id);
        if (!item) return { ok: false, message: "Menu item not found." };

        const nextAvailability = item.availability === "Available" ? "Out of Stock" : "Available";
        return this.update(id, { ...item, availability: nextAvailability });
    }
};

const SuspensionService = {
    normalizeDurationUnit(unit) {
        const raw = String(unit || "").trim().toLowerCase();
        if (raw === "day" || raw === "days") return "days";
        return "hours";
    },

    normalizeDurationValue(value) {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed < 1) return 0;
        return Math.min(parsed, 3650);
    },

    toTimestamp(value) {
        const time = new Date(value).getTime();
        return Number.isFinite(time) ? time : 0;
    },

    buildExpiresAt(suspendedAt, durationValue, durationUnit) {
        const value = this.normalizeDurationValue(durationValue);
        if (!value) return "";

        const unit = this.normalizeDurationUnit(durationUnit);
        const baseTime = this.toTimestamp(suspendedAt) || Date.now();
        const hours = unit === "days" ? value * 24 : value;
        const expiresAt = new Date(baseTime + (hours * 60 * 60 * 1000));
        return expiresAt.toISOString();
    },

    validateDurationInput(durationValue, durationUnit) {
        const nextValue = this.normalizeDurationValue(durationValue);
        if (!nextValue) {
            return {
                ok: false,
                message: i18n("suspensions_no_duration", "Please enter a valid suspension duration.")
            };
        }

        const nextUnit = this.normalizeDurationUnit(durationUnit);
        return { ok: true, value: nextValue, unit: nextUnit };
    },

    normalizeEntry(rawEntry) {
        const userId = String(rawEntry?.userId || rawEntry?.id || "").trim();
        const rawStatus = String(rawEntry?.status || "").trim().toLowerCase();
        const isSuspended = rawEntry?.isSuspended === true
            || rawEntry?.suspended === true
            || rawStatus === "suspended";

        const durationUnit = this.normalizeDurationUnit(
            rawEntry?.durationUnit
            || rawEntry?.durationType
            || rawEntry?.unit
        );
        const durationValue = this.normalizeDurationValue(
            rawEntry?.durationValue
            ?? rawEntry?.duration
            ?? rawEntry?.suspensionDuration
        );
        const suspendedAt = String(rawEntry?.suspendedAt || "").trim();
        let expiresAt = String(rawEntry?.expiresAt || rawEntry?.endsAt || "").trim();
        if (!expiresAt && isSuspended && durationValue > 0) {
            expiresAt = this.buildExpiresAt(suspendedAt, durationValue, durationUnit);
        }

        return {
            id: userId ? `sus-${userId}` : "",
            userId,
            isSuspended,
            reason: String(rawEntry?.reason || rawEntry?.suspensionReason || "").trim(),
            suspendedAt,
            liftedAt: String(rawEntry?.liftedAt || "").trim(),
            durationValue,
            durationUnit,
            expiresAt,
            updatedAt: String(rawEntry?.updatedAt || new Date().toISOString()),
            updatedBy: String(rawEntry?.updatedBy || "").trim()
        };
    },

    refreshExpiredEntries(entries) {
        const nowMs = Date.now();
        const nowIso = new Date(nowMs).toISOString();
        let changed = false;

        const refreshed = entries.map((entry) => {
            if (!entry?.isSuspended) return entry;
            const expiresAtMs = this.toTimestamp(entry.expiresAt);
            if (!expiresAtMs || expiresAtMs > nowMs) return entry;

            changed = true;
            return this.normalizeEntry({
                ...entry,
                isSuspended: false,
                liftedAt: String(entry?.liftedAt || nowIso),
                updatedAt: nowIso,
                updatedBy: String(entry?.updatedBy || "system-expired")
            });
        });

        return { entries: refreshed, changed };
    },

    getAll() {
        const raw = StorageService.getStudentSuspensions();
        if (!Array.isArray(raw)) return [];

        const normalized = raw
            .map((entry) => this.normalizeEntry(entry))
            .filter((entry) => entry.userId);

        const { entries, changed } = this.refreshExpiredEntries(normalized);
        if (changed) {
            this.saveAll(entries);
        }

        return entries;
    },

    saveAll(entries) {
        const normalized = Array.isArray(entries)
            ? entries.map((entry) => this.normalizeEntry(entry)).filter((entry) => entry.userId)
            : [];
        StorageService.saveStudentSuspensions(normalized);
    },

    getByUserId(userId) {
        const targetId = String(userId || "").trim();
        if (!targetId) return null;
        return this.getAll().find((entry) => entry.userId === targetId) || null;
    },

    isSuspended(userId) {
        return Boolean(this.getByUserId(userId)?.isSuspended === true);
    },

    getSuspensionMessage(userId) {
        const entry = this.getByUserId(userId);
        const baseMessage = i18n("suspensions_blocked_message", "Your account is suspended.");
        if (!entry || entry.isSuspended !== true) {
            return `${baseMessage} ${i18n("suspensions_contact_staff", "Please contact staff.")}`.trim();
        }

        const reason = String(entry?.reason || "").trim();
        if (!reason) {
            return `${baseMessage} ${i18n("suspensions_contact_staff", "Please contact staff.")}`.trim();
        }

        const reasonLabel = i18n("suspensions_reason_label", "Reason");
        const contactMessage = i18n("suspensions_contact_staff", "Please contact staff.");
        return `${baseMessage} ${reasonLabel}: ${reason}. ${contactMessage}`.trim();
    },

    suspendStudent(userId, reason, durationValue, durationUnit, actorUserId = "") {
        const targetId = String(userId || "").trim();
        if (!targetId) return { ok: false, message: "Student account not found." };

        const nextReason = String(reason || "").trim();
        if (!nextReason) {
            return {
                ok: false,
                message: i18n("suspensions_no_reason", "Please enter a suspension reason.")
            };
        }
        const duration = this.validateDurationInput(durationValue, durationUnit);
        if (!duration.ok) return duration;

        const now = new Date().toISOString();
        const expiresAt = this.buildExpiresAt(now, duration.value, duration.unit);
        const entries = this.getAll();
        const targetIndex = entries.findIndex((entry) => entry.userId === targetId);
        const previous = targetIndex >= 0 ? entries[targetIndex] : null;
        const nextEntry = this.normalizeEntry({
            ...previous,
            userId: targetId,
            isSuspended: true,
            reason: nextReason,
            suspendedAt: now,
            liftedAt: "",
            durationValue: duration.value,
            durationUnit: duration.unit,
            expiresAt,
            updatedAt: now,
            updatedBy: String(actorUserId || "").trim()
        });

        if (targetIndex >= 0) {
            entries[targetIndex] = nextEntry;
        } else {
            entries.push(nextEntry);
        }

        this.saveAll(entries);
        return { ok: true, entry: nextEntry };
    },

    adjustSuspensionDuration(userId, durationValue, durationUnit, actorUserId = "") {
        const targetId = String(userId || "").trim();
        if (!targetId) return { ok: false, message: "Student account not found." };

        const duration = this.validateDurationInput(durationValue, durationUnit);
        if (!duration.ok) return duration;

        const entries = this.getAll();
        const targetIndex = entries.findIndex((entry) => entry.userId === targetId);
        if (targetIndex < 0 || entries[targetIndex].isSuspended !== true) {
            return { ok: false, message: "Student account is not currently suspended." };
        }

        const now = new Date().toISOString();
        const nextEntry = this.normalizeEntry({
            ...entries[targetIndex],
            userId: targetId,
            isSuspended: true,
            suspendedAt: String(entries[targetIndex]?.suspendedAt || now),
            durationValue: duration.value,
            durationUnit: duration.unit,
            expiresAt: this.buildExpiresAt(now, duration.value, duration.unit),
            liftedAt: "",
            updatedAt: now,
            updatedBy: String(actorUserId || "").trim()
        });

        entries[targetIndex] = nextEntry;
        this.saveAll(entries);
        return { ok: true, entry: nextEntry };
    },

    unsuspendStudent(userId, actorUserId = "") {
        const targetId = String(userId || "").trim();
        if (!targetId) return { ok: false, message: "Student account not found." };

        const now = new Date().toISOString();
        const entries = this.getAll();
        const targetIndex = entries.findIndex((entry) => entry.userId === targetId);
        const previous = targetIndex >= 0 ? entries[targetIndex] : null;
        const nextEntry = this.normalizeEntry({
            ...previous,
            userId: targetId,
            isSuspended: false,
            reason: String(previous?.reason || "").trim(),
            suspendedAt: String(previous?.suspendedAt || "").trim(),
            liftedAt: now,
            updatedAt: now,
            updatedBy: String(actorUserId || "").trim()
        });

        if (targetIndex >= 0) {
            entries[targetIndex] = nextEntry;
        } else {
            entries.push(nextEntry);
        }

        this.saveAll(entries);
        return { ok: true, entry: nextEntry };
    }
};

const OrderService = {
    parseStatusInput(status) {
        const normalized = String(status || "").trim().toLowerCase();
        if (normalized === "pending") return "Pending";
        if (normalized === "completed" || normalized === "complete" || normalized === "done") return "Completed";
        return "";
    },

    normalizeStatus(status) {
        return this.parseStatusInput(status) || "Pending";
    },

    getAll() {
        const rawOrders = StorageService.getOrders();
        if (!Array.isArray(rawOrders)) return [];
        return rawOrders.map((order) => {
            const quantity = Number.isFinite(Number(order.quantity)) ? Math.max(1, Number(order.quantity)) : 1;
            const unitPrice = Helpers.parsePrice(order.unitPrice);
            const rawTotal = Helpers.parsePrice(order.totalPrice);
            const totalPrice = rawTotal > 0 ? rawTotal : unitPrice * quantity;
            const paymentMethod = Helpers.normalizePaymentMethod(order.paymentMethod);
            const paymentReference = paymentMethod === "GCash"
                ? String(order.paymentReference || "").trim()
                : "";

            return {
                id: String(order.id || Helpers.createId("ord")),
                userId: String(order.userId || ""),
                mealId: String(order.mealId || ""),
                mealName: String(order.mealName || "Unknown meal"),
                quantity,
                unitPrice,
                totalPrice,
                paymentMethod,
                paymentReference,
                status: this.normalizeStatus(order.status),
                hiddenByStaff: order.hiddenByStaff === true,
                placedAt: order.placedAt || new Date().toISOString()
            };
        });
    },

    saveAll(orders) {
        StorageService.saveOrders(orders);
    },

    getByUser(userId) {
        return this.getAll()
            .filter((order) => order.userId === userId)
            .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    },

    updateStatus(orderId, nextStatus) {
        const normalizedNextStatus = this.parseStatusInput(nextStatus);
        if (!normalizedNextStatus) {
            return { ok: false, message: "Invalid reservation status." };
        }

        const orders = this.getAll();
        const targetIndex = orders.findIndex((order) => order.id === orderId);
        if (targetIndex < 0) return { ok: false, message: "Reservation not found." };

        orders[targetIndex] = {
            ...orders[targetIndex],
            status: normalizedNextStatus
        };

        this.saveAll(orders);
        return { ok: true, order: orders[targetIndex] };
    },

    setHidden(orderId, shouldHide) {
        if (shouldHide !== true) {
            return { ok: false, message: "Restoring history orders is disabled." };
        }

        const orders = this.getAll();
        const targetIndex = orders.findIndex((order) => order.id === orderId);
        if (targetIndex < 0) return { ok: false, message: "Reservation not found." };
        if (orders[targetIndex].status !== "Completed") {
            return { ok: false, message: "Only completed orders can be hidden." };
        }
        if (orders[targetIndex].hiddenByStaff === true) {
            return { ok: true, order: orders[targetIndex] };
        }

        orders[targetIndex] = {
            ...orders[targetIndex],
            hiddenByStaff: true
        };

        this.saveAll(orders);
        return { ok: true, order: orders[targetIndex] };
    },

    placeFromCart(userId, cartEntries, paymentDetails = {}) {
        if (!userId) return { ok: false, message: "Login is required." };
        if (!Array.isArray(cartEntries) || cartEntries.length === 0) return { ok: false, message: "Your cart is empty." };

        const paymentMethod = Helpers.normalizePaymentMethod(paymentDetails.paymentMethod);
        const paymentReference = paymentMethod === "GCash"
            ? String(paymentDetails.paymentReference || "").trim()
            : "";

        const menuById = new Map(MenuService.getMenu().map((item) => [item.id, item]));
        const now = new Date().toISOString();
        const nextOrders = [];
        let blockedOutOfStock = 0;

        // Combine duplicate cart lines to avoid splitting one meal into many order records.
        const mergedCart = new Map();
        for (const entry of cartEntries) {
            const mealId = String(entry?.mealId || "");
            const quantity = Number.parseInt(entry?.quantity, 10);
            if (!mealId || !Number.isInteger(quantity) || quantity < 1) continue;
            mergedCart.set(mealId, (mergedCart.get(mealId) || 0) + quantity);
        }

        for (const [mealId, quantity] of mergedCart.entries()) {
            const menuItem = menuById.get(mealId);
            if (!menuItem) continue;

            if (menuItem.availability !== "Available") {
                blockedOutOfStock += 1;
                continue;
            }

            const totalPrice = Number(menuItem.price) * quantity;
            nextOrders.push({
                id: Helpers.createId("ord"),
                userId,
                mealId: menuItem.id,
                mealName: menuItem.name,
                quantity,
                unitPrice: Number(menuItem.price),
                totalPrice,
                paymentMethod,
                paymentReference,
                status: "Pending",
                hiddenByStaff: false,
                placedAt: now
            });
        }

        if (nextOrders.length === 0) {
            return {
                ok: false,
                message: blockedOutOfStock > 0
                    ? "Some items are out of stock. Remove them before checkout."
                    : "No valid items in your cart."
            };
        }

        const existing = this.getAll();
        this.saveAll([...existing, ...nextOrders]);

        return {
            ok: true,
            createdCount: nextOrders.length,
            blockedOutOfStock,
            paymentMethod
        };
    }
};

const NotificationService = {
    MAX_NOTIFICATIONS: 300,

    normalizeReadByStaffIds(rawIds) {
        if (!Array.isArray(rawIds)) return [];
        const unique = new Set();
        for (const rawId of rawIds) {
            const id = String(rawId || "").trim();
            if (id) unique.add(id);
        }
        return Array.from(unique);
    },

    normalizeEntry(entry) {
        const senderRole = Helpers.normalizeRole(entry?.senderRole) || ROLES.student;
        const receiverRole = Helpers.normalizeRole(entry?.receiverRole) || ROLES.staff;
        const senderName = String(entry?.senderName || "Student").trim() || "Student";
        const message = String(entry?.message || "").trim();
        const createdAtRaw = String(entry?.createdAt || "").trim();
        const createdAt = createdAtRaw && !Number.isNaN(Date.parse(createdAtRaw))
            ? createdAtRaw
            : new Date().toISOString();

        return {
            id: String(entry?.id || Helpers.createId("ntf")),
            type: String(entry?.type || "student_checkout"),
            senderId: String(entry?.senderId || "").trim(),
            senderRole,
            senderName,
            receiverId: String(entry?.receiverId || "").trim(),
            receiverRole,
            message,
            createdAt,
            readByStaffIds: this.normalizeReadByStaffIds(entry?.readByStaffIds)
        };
    },

    getAll() {
        const rawNotifications = StorageService.getNotifications();
        if (!Array.isArray(rawNotifications)) return [];

        let changed = false;
        const normalized = rawNotifications.map((entry) => {
            const next = this.normalizeEntry(entry);
            const sameShape = JSON.stringify(next) === JSON.stringify(entry);
            if (!sameShape) changed = true;
            return next;
        });

        if (changed) {
            this.saveAll(normalized);
        }

        return normalized;
    },

    saveAll(notifications) {
        const next = Array.isArray(notifications)
            ? notifications.map((entry) => this.normalizeEntry(entry))
            : [];
        if (next.length > this.MAX_NOTIFICATIONS) {
            next.splice(0, next.length - this.MAX_NOTIFICATIONS);
        }
        StorageService.saveNotifications(next);
    },

    createStudentToStaff(payload = {}) {
        const senderRole = Helpers.normalizeRole(payload.senderRole || ROLES.student);
        if (senderRole !== ROLES.student) {
            return { ok: false, message: "Only Student can send this notification type." };
        }

        const senderName = String(payload.senderName || "Student").trim() || "Student";
        const createdCount = Number.isFinite(Number(payload.createdCount))
            ? Math.max(1, Number(payload.createdCount))
            : 1;
        const orderLabel = createdCount === 1 ? "reservation" : "reservations";
        const paymentMethod = Helpers.normalizePaymentMethod(payload.paymentMethod);
        const defaultMessage = `${senderName} submitted ${createdCount} ${orderLabel} via ${paymentMethod}.`;
        const message = String(payload.message || defaultMessage).trim() || defaultMessage;

        const nextEntry = this.normalizeEntry({
            id: Helpers.createId("ntf"),
            type: "student_checkout",
            senderId: String(payload.senderId || "").trim(),
            senderRole: ROLES.student,
            senderName,
            receiverId: String(payload.receiverId || "").trim(),
            receiverRole: ROLES.staff,
            message,
            createdAt: new Date().toISOString(),
            readByStaffIds: []
        });

        const notifications = this.getAll();
        notifications.push(nextEntry);
        this.saveAll(notifications);
        return { ok: true, notification: nextEntry };
    },

    getUnreadForStaff(staffUserId) {
        const targetStaffId = String(staffUserId || "").trim();
        if (!targetStaffId) return [];

        return this.getAll()
            .filter((entry) => {
                if (entry.receiverRole !== ROLES.staff) return false;
                if (entry.receiverId && entry.receiverId !== targetStaffId) return false;
                return !entry.readByStaffIds.includes(targetStaffId);
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    markReadForStaff(notificationIds, staffUserId) {
        const targetStaffId = String(staffUserId || "").trim();
        if (!targetStaffId || !Array.isArray(notificationIds) || notificationIds.length === 0) {
            return { ok: false, markedCount: 0 };
        }

        const targetIds = new Set(
            notificationIds
                .map((id) => String(id || "").trim())
                .filter((id) => id)
        );

        if (targetIds.size === 0) return { ok: false, markedCount: 0 };

        let markedCount = 0;
        let changed = false;
        const notifications = this.getAll().map((entry) => {
            if (!targetIds.has(entry.id)) return entry;
            if (entry.receiverRole !== ROLES.staff) return entry;
            if (entry.receiverId && entry.receiverId !== targetStaffId) return entry;
            if (entry.readByStaffIds.includes(targetStaffId)) return entry;
            changed = true;
            markedCount += 1;
            return {
                ...entry,
                readByStaffIds: [...entry.readByStaffIds, targetStaffId]
            };
        });

        if (changed) {
            this.saveAll(notifications);
        }

        return { ok: true, markedCount };
    }
};

const SuggestionService = {
    saveSuggestion(payload) {
        const text = String(payload.text || "").trim();
        if (text.length < 3) return { ok: false, message: "Please enter at least 3 characters." };

        const existing = StorageService.getSuggestions();
        existing.push({
            id: Helpers.createId("sug"),
            userId: payload.userId || "",
            role: payload.role || "",
            fullName: payload.fullName || "",
            text,
            createdAt: new Date().toISOString()
        });
        StorageService.saveSuggestions(existing);
        return { ok: true };
    }
};

const UIController = {
    menuImageZoomScale: 1,
    menuImagePanX: 0,
    menuImagePanY: 0,
    menuImageMotionActive: false,
    menuImageMotionPermissionState: "idle",
    menuImageOrientationHandler: null,
    menuImageMotionBaseline: {
        beta: null,
        gamma: null
    },
    remoteSyncTimer: null,
    remoteSyncBusy: false,

    showLoading(text = "Loading...") {
        if (!elements.loadingOverlay) return;
        if (elements.loadingText) {
            elements.loadingText.textContent = text;
        }
        elements.loadingOverlay.classList.remove("hidden");
    },

    hideLoading() {
        elements.loadingOverlay?.classList.add("hidden");
    },

    stopRemoteSync() {
        if (this.remoteSyncTimer) {
            window.clearInterval(this.remoteSyncTimer);
            this.remoteSyncTimer = null;
        }
    },

    startRemoteSync() {
        this.stopRemoteSync();
        if (!ApiService.isEnabled()) return;

        this.remoteSyncTimer = window.setInterval(() => {
            void this.pullRemoteUpdates();
        }, REMOTE_SYNC_INTERVAL_MS);
    },

    async pullRemoteUpdates() {
        if (!RoleGuard.isLoggedIn()) return;
        if (!ApiService.isEnabled()) return;
        if (this.remoteSyncBusy) return;

        this.remoteSyncBusy = true;
        try {
            const beforeMenu = JSON.stringify(StorageService.getMenu() || []);
            const beforeOrders = JSON.stringify(StorageService.getOrders() || []);
            const beforeNotifications = JSON.stringify(StorageService.getNotifications() || []);
            const beforeUsers = JSON.stringify(StorageService.getUsers() || []);
            const beforeSuspensions = JSON.stringify(StorageService.getStudentSuspensions() || []);
            await StorageService.bootstrapFromRemote();
            const afterMenu = JSON.stringify(StorageService.getMenu() || []);
            const afterOrders = JSON.stringify(StorageService.getOrders() || []);
            const afterNotifications = JSON.stringify(StorageService.getNotifications() || []);
            const afterUsers = JSON.stringify(StorageService.getUsers() || []);
            const afterSuspensions = JSON.stringify(StorageService.getStudentSuspensions() || []);

            const menuChanged = beforeMenu !== afterMenu;
            const ordersChanged = beforeOrders !== afterOrders;
            const notificationsChanged = beforeNotifications !== afterNotifications;
            const usersChanged = beforeUsers !== afterUsers;
            const suspensionsChanged = beforeSuspensions !== afterSuspensions;
            const hasRemoteChanges = menuChanged || ordersChanged || notificationsChanged || usersChanged || suspensionsChanged;

            if (!hasRemoteChanges) return;

            if (usersChanged && state.currentUser?.id) {
                const nextUser = StorageService.getUsers().find(
                    (entry) => String(entry?.id || "") === String(state.currentUser?.id || "")
                );
                if (!nextUser) {
                    await AuthService.logout();
                    this.showAuthView();
                    window.location.hash = "";
                    Helpers.setMessage(
                        elements.authMessage,
                        "Your account is no longer available. Please contact staff.",
                        "error",
                        { toast: false }
                    );
                    return;
                }
                state.currentUser = AuthService.normalizeUser(nextUser);
            }

            if (
                (suspensionsChanged || usersChanged)
                && RoleGuard.isStudent()
                && state.currentUser?.id
                && SuspensionService.isSuspended(state.currentUser.id)
            ) {
                const suspendedUserId = String(state.currentUser?.id || "");
                await AuthService.logout();
                this.showAuthView();
                window.location.hash = "";
                Helpers.setMessage(
                    elements.authMessage,
                    SuspensionService.getSuspensionMessage(suspendedUserId),
                    "error",
                    { toast: false }
                );
                return;
            }

            this.renderAll();
            this.openSection(state.activeSection, { pushHash: false });

            if (notificationsChanged) {
                this.deliverStaffDashboardNotifications({ toast: true });
            }

            if (menuChanged) {
                if (RoleGuard.isStudent()) {
                    Helpers.setMessage(
                        elements.orderMessage,
                        "Menu updated. New items are now available.",
                        "success",
                        {
                            toastTitle: "Menu Updated",
                            toastForce: true,
                            toastDuration: 2400
                        }
                    );
                }
            }
        } finally {
            this.remoteSyncBusy = false;
        }
    },

    async init() {
        this.showLoading("Loading portal...");
        try {
            ThemeService.init();
            PreferenceService.init();
            this.applyLanguageText();
            await StorageService.bootstrapFromRemote();
            StorageService.ensureMenuSeeded();
            this.bindAuthTabs();
            this.bindAuthEvents();
            this.syncRegisterRoleFields();
            this.bindAppEvents();
            this.syncStickyOffsets();

            const restored = await AuthService.restoreSession();
            if (restored) {
                this.enterApp(restored, { useHash: true });
            } else {
                this.showAuthView();
            }
        } catch {
            this.showAuthView();
            Helpers.setMessage(elements.authMessage, "Failed to initialize portal. Please refresh.", "error");
        } finally {
            this.hideLoading();
        }
    },

    bindAuthTabs() {
        for (const btn of elements.authTabButtons) {
            btn.addEventListener("click", () => {
                this.setAuthTab(btn.dataset.authTab);
                Helpers.setMessage(elements.authMessage, "");
            });
        }
    },

    bindAuthEvents() {
        elements.registerRole?.addEventListener("change", () => this.syncRegisterRoleFields());

        document.querySelectorAll(".password-toggle-btn").forEach((toggleBtn) => {
            toggleBtn.addEventListener("click", () => {
                const targetId = String(toggleBtn.dataset.target || "");
                const targetInput = document.getElementById(targetId);
                if (!targetInput) return;

                const shouldShow = targetInput.type === "password";
                targetInput.type = shouldShow ? "text" : "password";
                toggleBtn.textContent = shouldShow ? "Hide" : "Show";
                toggleBtn.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
            });
        });

        elements.registerForm?.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(elements.registerForm);
            const payload = {
                fullName: String(formData.get("fullName") || ""),
                idNumber: String(formData.get("idNumber") || ""),
                classDepartment: String(formData.get("classDepartment") || ""),
                email: String(formData.get("email") || ""),
                password: String(formData.get("password") || ""),
                confirmPassword: String(formData.get("confirmPassword") || ""),
                role: String(formData.get("role") || "")
            };

            this.showLoading("Creating account...");
            try {
                const result = await AuthService.register(payload);
                if (!result.ok) {
                    Helpers.setMessage(elements.authMessage, result.message, "error");
                    return;
                }

                this.enterApp(result.user, { useHash: false });
                elements.registerForm.reset();
                document.querySelectorAll(".password-toggle-btn").forEach((toggleBtn) => {
                    const targetId = String(toggleBtn.dataset.target || "");
                    const targetInput = document.getElementById(targetId);
                    if (targetInput) {
                        targetInput.type = "password";
                    }
                    toggleBtn.textContent = "Show";
                    toggleBtn.setAttribute("aria-label", "Show password");
                });
                this.syncRegisterRoleFields();
                elements.loginForm?.reset();
                Helpers.setMessage(elements.authMessage, "");
            } finally {
                this.hideLoading();
            }
        });

        elements.loginForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const selectedRole = document.querySelector("input[name='login-role']:checked")?.value || ROLES.student;
            const formData = new FormData(elements.loginForm);

            const payload = {
                email: String(formData.get("email") || ""),
                password: String(formData.get("password") || ""),
                role: selectedRole
            };

            this.showLoading("Signing in...");
            try {
                const result = await AuthService.login(payload);
                if (!result.ok) {
                    Helpers.setMessage(elements.authMessage, result.message, "error");
                    return;
                }

                this.enterApp(result.user, { useHash: true });
                elements.loginForm.reset();
                Helpers.setMessage(elements.authMessage, "");
            } finally {
                this.hideLoading();
            }
        });
    },

    syncRegisterRoleFields() {
        const selectedRole = Helpers.normalizeRole(elements.registerRole?.value) || ROLES.student;
        const isStudent = selectedRole === ROLES.student;

        if (elements.registerIdGroup) {
            elements.registerIdGroup.classList.toggle("hidden", !isStudent);
        }
        if (elements.registerClassGroup) {
            elements.registerClassGroup.classList.toggle("hidden", !isStudent);
        }

        if (elements.registerIdNumber) {
            elements.registerIdNumber.required = isStudent;
            elements.registerIdNumber.disabled = !isStudent;
            if (!isStudent) elements.registerIdNumber.value = "";
        }

        if (elements.registerClassDepartment) {
            elements.registerClassDepartment.required = isStudent;
            elements.registerClassDepartment.disabled = !isStudent;
            if (!isStudent) elements.registerClassDepartment.value = "";
        }
    },

    bindAppEvents() {
        for (const btn of elements.navButtons) {
            btn.addEventListener("click", () => this.openSection(btn.dataset.section));
        }

        elements.logoutBtn?.addEventListener("click", () => { void this.logout(); });
        elements.themeDarkToggle?.addEventListener("change", (event) => {
            ThemeService.set(event.target.checked ? "dark" : "light");
        });
        elements.settingsNotificationsToggle?.addEventListener("change", (event) => {
            PreferenceService.setNotifications(Boolean(event.target.checked));
        });
        elements.settingsLanguageSelect?.addEventListener("change", (event) => {
            PreferenceService.setLanguage(event.target.value);
            this.applyLanguageText();
            if (RoleGuard.isLoggedIn()) {
                this.renderAll();
                this.openSection(state.activeSection, { pushHash: false });
            }
        });
        elements.settingsFontSizeSelect?.addEventListener("change", (event) => {
            PreferenceService.setFontSize(event.target.value);
        });
        elements.settingsPasswordForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            void this.handlePasswordChangeSubmit();
        });
        elements.settingsDeleteAccountForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            void this.handleDeleteAccountSubmit();
        });
        window.addEventListener("hashchange", () => this.routeFromHash());
        window.addEventListener("storage", (event) => { void this.handleStorageSync(event); });
        window.addEventListener("resize", () => this.syncStickyOffsets());

        elements.orderForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleOrderFormSubmit();
        });

        elements.mealList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const mealId = button.dataset.mealId || "";
            const action = button.dataset.action || "";

            if (action === "add-to-cart") this.addToCart(mealId, 1);
            if (action === "view-item-info") this.showMealInfo(mealId);
            if (action === "zoom-menu-image") this.openMenuImageModal(mealId);
        });

        elements.menuSearchInput?.addEventListener("input", (event) => {
            state.menuSearch = String(event.target.value || "");
            this.renderMenu();
        });

        elements.menuCategoryTabs?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-category]");
            if (!button) return;
            state.menuCategory = String(button.dataset.category || "all").toLowerCase();
            this.renderMenu();
        });

        elements.currentOrdersList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const mealId = button.dataset.mealId || "";

            if (button.dataset.action === "qty-minus") this.adjustCartItem(mealId, -1);
            if (button.dataset.action === "qty-plus") this.adjustCartItem(mealId, 1);
        });

        elements.currentCheckoutBtn?.addEventListener("click", () => this.checkoutCart());
        elements.currentClearBtn?.addEventListener("click", () => this.clearCart());
        elements.currentPaymentMethod?.addEventListener("change", (event) => {
            state.checkoutPaymentMethod = Helpers.normalizePaymentMethod(event.target.value);
            this.syncPaymentControls();
        });

        elements.ordersList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const orderId = button.dataset.orderId || "";
            const action = button.dataset.action || "";
            if (action === "set-order-status") {
                const status = button.dataset.status || "";
                this.handleStaffOrderStatusUpdate(orderId, status);
                return;
            }
            if (action === "toggle-order-hidden") {
                this.handleStaffOrderHiddenUpdate(orderId, true);
            }
        });

        elements.ordersCompletedList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const orderId = button.dataset.orderId || "";
            const action = button.dataset.action || "";
            if (action === "set-order-status") {
                const status = button.dataset.status || "";
                this.handleStaffOrderStatusUpdate(orderId, status);
                return;
            }
            if (action === "toggle-order-hidden") {
                this.handleStaffOrderHiddenUpdate(orderId, true);
            }
        });

        elements.staffOrdersSearch?.addEventListener("input", () => this.renderOrders());
        elements.staffOrdersFilter?.addEventListener("change", () => this.renderOrders());
        elements.staffHistoryToggleBtn?.addEventListener("click", () => {
            state.staffHistoryVisible = !state.staffHistoryVisible;
            this.renderOrders();
        });

        elements.editProfileBtn?.addEventListener("click", () => this.showProfileEditor(true));
        elements.cancelProfileBtn?.addEventListener("click", () => this.showProfileEditor(false));
        elements.profileForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleProfileSubmit();
        });

        elements.manageMenuForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleManageMenuSubmit();
        });
        elements.menuCancelEditBtn?.addEventListener("click", () => this.resetManageMenuForm());

        elements.itemInfoModalClose?.addEventListener("click", () => this.closeItemInfoModal({ ok: false, cancelled: true, message: "Item info input cancelled." }));
        elements.itemInfoModal?.addEventListener("click", (event) => {
            if (event.target === elements.itemInfoModal) {
                this.closeItemInfoModal({ ok: false, cancelled: true, message: "Item info input cancelled." });
            }
        });
        elements.menuImageClose?.addEventListener("click", () => this.closeMenuImageModal());
        elements.menuImageModal?.addEventListener("click", (event) => {
            if (event.target === elements.menuImageModal) {
                this.closeMenuImageModal();
            }
        });
        elements.menuImageZoomIn?.addEventListener("click", () => this.setMenuImageZoom(this.menuImageZoomScale + MENU_IMAGE_ZOOM_STEP));
        elements.menuImageZoomOut?.addEventListener("click", () => this.setMenuImageZoom(this.menuImageZoomScale - MENU_IMAGE_ZOOM_STEP));
        elements.menuImageZoomReset?.addEventListener("click", () => this.setMenuImageZoom(1));
        elements.menuImagePreview?.addEventListener("wheel", (event) => {
            event.preventDefault();
            const delta = event.deltaY < 0 ? MENU_IMAGE_ZOOM_STEP : -MENU_IMAGE_ZOOM_STEP;
            this.setMenuImageZoom(this.menuImageZoomScale + delta);
        }, { passive: false });
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && elements.itemInfoModal && !elements.itemInfoModal.classList.contains("hidden")) {
                this.closeItemInfoModal({ ok: false, cancelled: true, message: "Item info input cancelled." });
                return;
            }
            if (event.key === "Escape" && elements.menuImageModal && !elements.menuImageModal.classList.contains("hidden")) {
                this.closeMenuImageModal();
                return;
            }
            if (elements.menuImageModal && !elements.menuImageModal.classList.contains("hidden")) {
                if (event.key === "+" || event.key === "=") this.setMenuImageZoom(this.menuImageZoomScale + MENU_IMAGE_ZOOM_STEP);
                if (event.key === "-" || event.key === "_") this.setMenuImageZoom(this.menuImageZoomScale - MENU_IMAGE_ZOOM_STEP);
            }
        });

        elements.manageMenuList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const itemId = button.dataset.itemId || "";

            if (button.dataset.action === "edit-menu") this.startMenuEdit(itemId);
            if (button.dataset.action === "delete-menu") this.deleteMenuItem(itemId);
            if (button.dataset.action === "toggle-menu") this.toggleMenuItem(itemId);
        });

        elements.suspensionsList?.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const action = String(button.dataset.action || "");
            const card = button.closest(".suspension-card");
            if (action === "toggle-suspension-settings") {
                this.toggleSuspensionSettings(card, button);
                return;
            }

            const userId = String(button.dataset.userId || "");
            if (!userId) return;
            const reasonInput = card?.querySelector(".suspension-reason-input");
            const durationInput = card?.querySelector(".suspension-duration-input");
            const durationUnitInput = card?.querySelector(".suspension-duration-unit");
            const reason = String(reasonInput?.value || "");
            const durationValue = String(durationInput?.value || "");
            const durationUnit = String(durationUnitInput?.value || "");

            this.handleSuspensionAction(userId, action, {
                reason,
                durationValue,
                durationUnit
            });
        });
        elements.suspensionsSearchInput?.addEventListener("input", (event) => {
            state.suspensionsSearch = String(event.target.value || "");
            this.renderSuspensions();
        });

        elements.suggestionSubmitBtn?.addEventListener("click", () => this.submitSuggestion());
    },

    setAuthTab(tabName) {
        const selectedTab = tabName === "register" ? "register" : "login";

        for (const btn of elements.authTabButtons) {
            btn.classList.toggle("active", btn.dataset.authTab === selectedTab);
        }

        elements.loginForm.classList.toggle("active", selectedTab === "login");
        elements.registerForm.classList.toggle("active", selectedTab === "register");
        if (selectedTab === "register") this.syncRegisterRoleFields();
    },

    showAuthView() {
        this.stopRemoteSync();
        document.body.classList.remove("mobile-cart-docked");
        elements.appView.classList.add("hidden");
        elements.authView.classList.remove("hidden");
        this.setAuthTab("login");
        Helpers.clearMessages();
    },

    enterApp(user, options = {}) {
        state.currentUser = user;
        state.cart = [];
        state.editingMenuId = "";
        state.staffHistoryVisible = false;
        state.menuSearch = "";
        state.menuCategory = "all";
        state.suspensionsSearch = "";
        state.checkoutPaymentMethod = "On-site";
        state.gcashReference = "";
        if (elements.staffOrdersSearch) {
            elements.staffOrdersSearch.value = "";
        }
        if (elements.staffOrdersFilter) {
            elements.staffOrdersFilter.value = "all";
        }
        if (elements.suspensionsSearchInput) {
            elements.suspensionsSearchInput.value = "";
        }

        elements.authView.classList.add("hidden");
        elements.appView.classList.remove("hidden");
        this.syncStickyOffsets();

        this.renderAll();
        this.showProfileEditor(false);
        this.resetManageMenuForm();
        if (elements.settingsPasswordForm) {
            elements.settingsPasswordForm.reset();
        }
        if (elements.settingsDeleteAccountForm) {
            elements.settingsDeleteAccountForm.reset();
        }
        this.startRemoteSync();
        void this.pullRemoteUpdates();

        if (options.useHash) {
            this.routeFromHash();
        } else {
            this.openSection(RoleGuard.defaultSection(), { pushHash: true });
        }

        this.deliverStaffDashboardNotifications({ toast: true });
    },

    async logout() {
        this.showLoading("Signing out...");
        try {
            const result = await AuthService.logout();
            if (!result.ok) {
                Helpers.setMessage(elements.systemMessage, result.message, "error");
                return;
            }
            this.showAuthView();
            window.location.hash = "";
        } finally {
            this.hideLoading();
        }
    },

    async handleStorageSync(event) {
        if (!event.key) return;
        if (event.key === STORAGE_KEYS.theme) {
            ThemeService.apply(event.newValue);
            return;
        }
        if (event.key === STORAGE_KEYS.language) {
            PreferenceService.applyLanguage(event.newValue);
            this.applyLanguageText();
            if (RoleGuard.isLoggedIn()) {
                this.renderAll();
                this.openSection(state.activeSection, { pushHash: false });
            }
            return;
        }
        if (event.key === STORAGE_KEYS.fontSize) {
            PreferenceService.applyFontSize(event.newValue);
            return;
        }
        if (event.key === STORAGE_KEYS.notificationsEnabled) {
            PreferenceService.applyNotifications(event.newValue);
            return;
        }
        if (event.key === STORAGE_KEYS.studentSuspensions) {
            if (RoleGuard.isStaff()) {
                this.renderSuspensions();
            }
            if (
                RoleGuard.isStudent()
                && state.currentUser?.id
                && SuspensionService.isSuspended(state.currentUser.id)
            ) {
                const suspendedUserId = String(state.currentUser?.id || "");
                await AuthService.logout();
                this.showAuthView();
                window.location.hash = "";
                Helpers.setMessage(
                    elements.authMessage,
                    SuspensionService.getSuspensionMessage(suspendedUserId),
                    "error",
                    { toast: false }
                );
            }
            return;
        }

        if (!RoleGuard.isLoggedIn()) return;

        if (event.key === STORAGE_KEYS.menu) {
            this.renderMenu();
            this.renderOrderSelect();
            this.renderCart();
            this.renderManageMenu();
            return;
        }

        if (event.key === STORAGE_KEYS.notifications) {
            this.deliverStaffDashboardNotifications({ toast: true });
            return;
        }

        if (event.key === STORAGE_KEYS.orders && RoleGuard.canAccessSection("orders")) {
            this.renderOrders();
            return;
        }

        if (event.key === STORAGE_KEYS.users || event.key === STORAGE_KEYS.session) {
            const restored = await AuthService.restoreSession();
            if (!restored) {
                this.showAuthView();
                return;
            }
            this.renderAll();
            this.openSection(state.activeSection, { pushHash: true });
        }
    },

    routeFromHash() {
        if (!RoleGuard.isLoggedIn()) return;
        const hashSection = window.location.hash.replace("#", "").trim();
        if (!hashSection || !elements.sections[hashSection]) {
            this.openSection(RoleGuard.defaultSection(), { pushHash: true });
            return;
        }
        // Normalize URL hash as well, especially when hash points to restricted sections.
        this.openSection(hashSection, { pushHash: true });
    },

    openSection(sectionName, options = {}) {
        if (!RoleGuard.isLoggedIn()) {
            this.showAuthView();
            return;
        }

        const targetSection = elements.sections[sectionName] ? sectionName : RoleGuard.defaultSection();
        let nextSection = targetSection;
        let blockedMessage = "";

        if (!RoleGuard.canAccessSection(targetSection)) {
            blockedMessage = RoleGuard.restrictedMessage(targetSection);
            nextSection = RoleGuard.defaultSection();
        }

        state.activeSection = nextSection;

        for (const [name, sectionElement] of Object.entries(elements.sections)) {
            const isActive = name === nextSection;
            sectionElement.classList.toggle("hidden", !isActive);
            if (!isActive) sectionElement.classList.remove("section-enter");
        }
        this.playSectionEnterAnimation(nextSection);

        this.renderNavigation();
        if (options.pushHash !== false) window.location.hash = nextSection;

        if (blockedMessage) {
            Helpers.setMessage(elements.systemMessage, blockedMessage, "error");
        } else {
            Helpers.setMessage(elements.systemMessage, "");
        }
    },

    playSectionEnterAnimation(sectionName) {
        const sectionElement = elements.sections[sectionName];
        if (!sectionElement) return;
        sectionElement.classList.remove("section-enter");
        void sectionElement.offsetWidth;
        sectionElement.classList.add("section-enter");
    },

    applyLanguageText() {
        if (elements.profileSectionTitle) elements.profileSectionTitle.textContent = i18n("profile_title", "Profile");
        if (elements.profileSectionSubtitle) elements.profileSectionSubtitle.textContent = i18n("profile_subtitle", "View your account details.");
        if (elements.settingsTitle) elements.settingsTitle.textContent = i18n("settings_title", "Settings");
        if (elements.settingsDarkModeLabel) elements.settingsDarkModeLabel.textContent = i18n("settings_dark_mode", "Dark Mode");
        if (elements.settingsNotificationsLabel) elements.settingsNotificationsLabel.textContent = i18n("settings_notifications", "Notifications");
        if (elements.settingsLanguageLabel) elements.settingsLanguageLabel.textContent = i18n("settings_language", "Language");
        if (elements.settingsFontSizeLabel) elements.settingsFontSizeLabel.textContent = i18n("settings_font_size", "Font Size");
        if (elements.settingsPasswordTitle) elements.settingsPasswordTitle.textContent = i18n("settings_password_title", "Change Password");
        if (elements.settingsCurrentPasswordLabel) elements.settingsCurrentPasswordLabel.textContent = i18n("settings_current_password", "Current Password");
        if (elements.settingsNewPasswordLabel) elements.settingsNewPasswordLabel.textContent = i18n("settings_new_password", "New Password");
        if (elements.settingsConfirmPasswordLabel) elements.settingsConfirmPasswordLabel.textContent = i18n("settings_confirm_password", "Confirm New Password");
        if (elements.settingsPasswordSubmitBtn) elements.settingsPasswordSubmitBtn.textContent = i18n("settings_password_submit", "Update Password");
        if (elements.settingsDeleteAccountTitle) elements.settingsDeleteAccountTitle.textContent = i18n("settings_delete_account_title", "Delete Account");
        if (elements.settingsDeleteAccountWarning) elements.settingsDeleteAccountWarning.textContent = i18n("settings_delete_account_warning", "This action is permanent and cannot be undone.");
        if (elements.settingsDeleteCurrentPasswordLabel) elements.settingsDeleteCurrentPasswordLabel.textContent = i18n("settings_delete_current_password", "Current Password");
        if (elements.settingsDeleteAccountBtn) elements.settingsDeleteAccountBtn.textContent = i18n("settings_delete_account_submit", "Delete Account");
        if (elements.suspensionsTitle) elements.suspensionsTitle.textContent = i18n("suspensions_title", "Student Suspension");
        if (elements.suspensionsSubtitle) elements.suspensionsSubtitle.textContent = i18n("suspensions_subtitle", "Suspend or unsuspend student accounts.");
        if (elements.suspensionsSearchLabel) elements.suspensionsSearchLabel.textContent = i18n("suspensions_search_label", "Search Student");
        if (elements.suspensionsSearchInput) elements.suspensionsSearchInput.placeholder = i18n("suspensions_search_placeholder", "e.g. Juan, 123456789012, Grade 10");

        if (elements.settingsCurrentPassword) {
            elements.settingsCurrentPassword.placeholder = i18n("settings_current_password_placeholder", "Enter current password");
        }
        if (elements.settingsNewPassword) {
            elements.settingsNewPassword.placeholder = i18n("settings_new_password_placeholder", "Minimum 6 characters");
        }
        if (elements.settingsConfirmPassword) {
            elements.settingsConfirmPassword.placeholder = i18n("settings_confirm_password_placeholder", "Re-enter new password");
        }
        if (elements.settingsDeleteCurrentPassword) {
            elements.settingsDeleteCurrentPassword.placeholder = i18n("settings_delete_current_password_placeholder", "Enter current password to confirm");
        }

        if (elements.settingsFontSizeSelect) {
            const smallOption = elements.settingsFontSizeSelect.querySelector("option[value='small']");
            const mediumOption = elements.settingsFontSizeSelect.querySelector("option[value='medium']");
            const largeOption = elements.settingsFontSizeSelect.querySelector("option[value='large']");
            if (smallOption) smallOption.textContent = i18n("settings_font_small", "Small");
            if (mediumOption) mediumOption.textContent = i18n("settings_font_medium", "Medium");
            if (largeOption) largeOption.textContent = i18n("settings_font_large", "Large");
        }

        if (elements.staffOrdersSearchLabel) {
            elements.staffOrdersSearchLabel.textContent = i18n("orders_search_label", "Search Student/Reserve/Date");
        }
        if (elements.staffOrdersSearch) {
            elements.staffOrdersSearch.placeholder = i18n("orders_search_placeholder", "e.g. Juan, Sisig, 2026-02-17");
        }
        if (elements.staffOrdersFilterLabel) {
            elements.staffOrdersFilterLabel.textContent = i18n("orders_filter_label", "Filter List");
        }
        this.populateStaffGradeSectionFilter();
        if (elements.staffHistoryToggleBtn) {
            elements.staffHistoryToggleBtn.textContent = state.staffHistoryVisible
                ? i18n("orders_history_toggle_hide", "Hide History Orders")
                : i18n("orders_history_toggle_show", "Show History Orders");
        }
        if (elements.staffFooterText) {
            elements.staffFooterText.textContent = i18n(
                "staff_footer_text",
                "Staff Portal Footer: Manage reservations, menu updates, and records carefully."
            );
        }
    },

    renderAll() {
        this.applyLanguageText();
        this.renderWelcome();
        this.renderNavigation();
        this.renderFooterRoleState();
        this.syncStickyOffsets();
        this.renderDashboardRoleState();
        this.renderMenu();
        this.renderOrderSelect();
        this.renderCart();
        this.renderProfile();
        this.renderOrders();
        this.renderManageMenu();
        this.renderSuspensions();
    },

    syncStickyOffsets() {
        const topbar = document.querySelector(".topbar");
        if (!topbar) return;

        const topbarHeight = Math.ceil(topbar.getBoundingClientRect().height || 0);
        const stickyTop = Math.max(92, topbarHeight + 12);
        document.documentElement.style.setProperty("--current-orders-sticky-top", `${stickyTop}px`);
    },

    renderWelcome() {
        if (!state.currentUser) return;
        const roleLabel = state.currentUser.role === ROLES.staff
            ? i18n("role_staff", "Staff")
            : i18n("role_student", "Student");
        elements.welcomeText.textContent = `${i18n("welcome", "Welcome")}, ${state.currentUser.fullName} (${roleLabel})`;
    },

    renderNavigation() {
        const labels = {
            dashboard: i18n("nav_dashboard", "Menu"),
            profile: i18n("nav_profile", "Profile"),
            orders: state.currentUser?.role === ROLES.staff
                ? i18n("nav_student_orders", "Student Reservations")
                : i18n("nav_orders", "History"),
            "manage-menu": i18n("nav_manage_menu", "Manage Menu"),
            suspensions: i18n("nav_suspensions", "Student Suspension")
        };

        for (const btn of elements.navButtons) {
            const allowedRole = btn.dataset.role || "all";
            const visible = allowedRole === "all" || allowedRole === state.currentUser?.role;
            const section = String(btn.dataset.section || "");
            if (labels[section]) {
                btn.textContent = labels[section];
            }
            btn.classList.toggle("hidden", !visible);
            btn.classList.toggle("active", visible && btn.dataset.section === state.activeSection);
        }
    },

    renderFooterRoleState() {
        const isStaff = state.currentUser?.role === ROLES.staff;
        elements.staffFooterBanner?.classList.toggle("hidden", !isStaff);
    },

    renderDashboardRoleState() {
        const isStudent = RoleGuard.isStudent();
        document.body.classList.toggle("mobile-cart-docked", isStudent);
        elements.studentOrderPanel?.classList.toggle("hidden", !isStudent);
        elements.currentOrdersPanel?.classList.toggle("hidden", !isStudent);
        elements.staffOrderBlocked?.classList.toggle("hidden", isStudent);

        if (!isStudent) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error", { toast: false });
        } else {
            Helpers.setMessage(elements.orderMessage, "");
        }
    },

    deliverStaffDashboardNotifications(options = {}) {
        if (!RoleGuard.isStaff()) return;
        const staffUserId = String(state.currentUser?.id || "").trim();
        if (!staffUserId) return;

        const unread = NotificationService.getUnreadForStaff(staffUserId);
        if (unread.length === 0) return;

        const latest = unread[0];
        const extraCount = Math.max(0, unread.length - 1);
        const extraLabel = extraCount > 0 ? ` (+${extraCount} more)` : "";
        const message = `${latest.message}${extraLabel}`;

        Helpers.setMessage(
            elements.systemMessage,
            message,
            "success",
            {
                toast: options.toast !== false,
                toastForce: true,
                toastTitle: "Staff Dashboard"
            }
        );

        NotificationService.markReadForStaff(
            unread.map((entry) => entry.id),
            staffUserId
        );
    },

    renderMenu() {
        const menu = MenuService.getMenu();
        if (!elements.mealList) return;

        const categories = MenuService.getCategories(menu);
        const categoryMeta = categories.map((category) => ({
            category,
            label: category === "Snack" ? "Snacks" : category,
            key: Helpers.categoryKey(category)
        }));

        const searchQuery = String(state.menuSearch || "").trim().toLowerCase();
        const selectedStateKey = String(state.menuCategory || "all");
        const normalizedSelectedKey = selectedStateKey === "all"
            ? "all"
            : Helpers.categoryKey(selectedStateKey);
        const allowedKeys = new Set(categoryMeta.map((entry) => entry.key));
        const selectedCategoryKey = normalizedSelectedKey === "all" || allowedKeys.has(normalizedSelectedKey)
            ? normalizedSelectedKey
            : "all";
        state.menuCategory = selectedCategoryKey;

        if (elements.menuSearchInput && elements.menuSearchInput.value !== state.menuSearch) {
            elements.menuSearchInput.value = state.menuSearch;
        }

        if (elements.menuCategoryTabs) {
            elements.menuCategoryTabs.innerHTML = `
                <button type="button" class="menu-filter-btn ${selectedCategoryKey === "all" ? "active" : ""}" data-category="all">All</button>
                ${categoryMeta
                    .map((entry) => `
                        <button
                            type="button"
                            class="menu-filter-btn ${selectedCategoryKey === entry.key ? "active" : ""}"
                            data-category="${Helpers.escapeHtml(entry.key)}"
                        >
                            ${Helpers.escapeHtml(entry.label)}
                        </button>
                    `)
                    .join("")}
            `;
        }

        const canOrder = RoleGuard.isStudent();
        const filteredMenu = menu.filter((item) => {
            const itemCategoryKey = Helpers.categoryKey(item.category);
            const categoryMatch = selectedCategoryKey === "all" || itemCategoryKey === selectedCategoryKey;
            const haystack = `${item.name} ${item.category} ${item.nutrition} ${item.description || ""}`.toLowerCase();
            const searchMatch = !searchQuery || haystack.includes(searchQuery);
            return categoryMatch && searchMatch;
        });

        if (filteredMenu.length === 0) {
            elements.mealList.innerHTML = `<p class="muted-msg">No menu items match your search.</p>`;
            return;
        }

        const groups = selectedCategoryKey === "all"
            ? categoryMeta
                .map((entry) => ({
                    title: entry.label,
                    items: filteredMenu.filter((item) => Helpers.categoryKey(item.category) === entry.key)
                }))
                .filter((group) => group.items.length > 0)
            : [{
                title: categoryMeta.find((entry) => entry.key === selectedCategoryKey)?.label || "Menu",
                items: filteredMenu
            }];

        elements.mealList.innerHTML = groups
            .map((group) => {
                const cards = group.items.length > 0
                    ? group.items.map((item) => this.renderMealCard(item, canOrder)).join("")
                    : `<p class="muted-msg">No items in this category.</p>`;

                return `
                    <section>
                        <h4 class="meal-category-title menu-section-title">${Helpers.escapeHtml(group.title)}</h4>
                        <div class="meal-grid">${cards}</div>
                    </section>
                `;
            })
            .join("");
    },

    renderMealCard(item, canOrder) {
        const imageMarkup = item.imageUrl
            ? `<img class="meal-image" src="${Helpers.escapeHtml(item.imageUrl)}" alt="${Helpers.escapeHtml(item.name)}">`
            : `<div class="meal-image-empty"></div>`;

        const availabilityClass = item.availability === "Available" ? "availability-available" : "availability-out";
        const canAdd = canOrder && item.availability === "Available";
        const isOutOfStock = item.availability !== "Available";
        const infoButtonMarkup = `
            <button
                type="button"
                class="btn btn-secondary small-btn"
                data-action="view-item-info"
                data-meal-id="${Helpers.escapeHtml(item.id)}"
            >
                Info
            </button>
        `;
        const zoomButtonMarkup = canOrder && item.imageUrl
            ? `
                <button
                    type="button"
                    class="btn btn-secondary small-btn meal-image-zoom-btn"
                    data-action="zoom-menu-image"
                    data-meal-id="${Helpers.escapeHtml(item.id)}"
                >
                    Zoom Image
                </button>
            `
            : ``;
        const orderButtonMarkup = canOrder
            ? `
                <button
                    type="button"
                    class="btn ${canAdd ? "btn-primary" : "btn-secondary"} small-btn ${canAdd ? "" : "meal-add-out-btn"}"
                    data-action="add-to-cart"
                    data-meal-id="${Helpers.escapeHtml(item.id)}"
                >
                    ${canAdd ? "Add to Cart" : "Out of Stock"}
                </button>
            `
            : ``;
        const actionButtons = `${orderButtonMarkup}${infoButtonMarkup}${zoomButtonMarkup}`;

        return `
            <article class="meal-card ${isOutOfStock ? "meal-card-out" : ""}">
                <div class="meal-image-wrap">${imageMarkup}</div>
                <h4>${Helpers.escapeHtml(item.name)}</h4>
                <div class="meal-meta-row">
                    <p class="meal-price">${Helpers.formatPrice(item.price)}</p>
                    <span class="availability-badge ${availabilityClass}">${Helpers.escapeHtml(item.availability)}</span>
                </div>
                <p class="meal-nutrition">${Helpers.escapeHtml(Helpers.nutritionLabel(item))}</p>
                <div class="card-actions">${actionButtons}</div>
            </article>
        `;
    },

    showMealInfo(mealId) {
        const item = MenuService.getById(mealId);
        if (!item) {
            Helpers.setMessage(elements.orderMessage, "Menu item not found.", "error");
            return;
        }

        const description = item.description || "No description provided.";
        const nutrition = item.nutrition || Helpers.nutritionLabel(item);
        if (!elements.itemInfoModal || !elements.itemInfoModalTitle || !elements.itemInfoModalContent || !elements.itemInfoModalActions) {
            window.alert(
                [
                    `Item: ${item.name}`,
                    `Category: ${item.category}`,
                    `Price: ${Helpers.formatPrice(item.price)}`,
                    `Availability: ${item.availability}`,
                    `Description: ${description}`,
                    `Nutrition: ${nutrition}`
                ].join("\n")
            );
            return;
        }

        elements.itemInfoModalTitle.textContent = `${item.name} Info`;
        elements.itemInfoModalContent.innerHTML = `
            <div class="item-info-line"><span>Category</span><strong>${Helpers.escapeHtml(item.category)}</strong></div>
            <div class="item-info-line"><span>Price</span><strong>${Helpers.escapeHtml(Helpers.formatPrice(item.price))}</strong></div>
            <div class="item-info-line"><span>Availability</span><strong>${Helpers.escapeHtml(item.availability)}</strong></div>
            <div class="item-info-line"><span>Description</span><strong>${Helpers.escapeHtml(description)}</strong></div>
            <div class="item-info-line"><span>Nutritional Value</span><strong>${Helpers.escapeHtml(nutrition)}</strong></div>
        `;
        elements.itemInfoModalActions.innerHTML = `<button type="button" class="btn btn-primary" id="item-info-close-view-btn">Close</button>`;
        Helpers.setMessage(elements.itemInfoModalMessage, "");
        this.openItemInfoModal();
        document.getElementById("item-info-close-view-btn")?.addEventListener("click", () => this.closeItemInfoModal(), { once: true });
    },

    openItemInfoModal() {
        if (!elements.itemInfoModal) return;
        elements.itemInfoModal.classList.remove("hidden");
        this.syncModalBodyState();
    },

    closeItemInfoModal(result = null) {
        if (elements.itemInfoModal) elements.itemInfoModal.classList.add("hidden");
        this.syncModalBodyState();
        if (elements.itemInfoModalContent) elements.itemInfoModalContent.innerHTML = "";
        if (elements.itemInfoModalActions) elements.itemInfoModalActions.innerHTML = "";
        Helpers.setMessage(elements.itemInfoModalMessage, "");

        if (typeof this.itemInfoModalResolver === "function") {
            const resolver = this.itemInfoModalResolver;
            this.itemInfoModalResolver = null;
            resolver(result || { ok: false, cancelled: true, message: "Item info input cancelled." });
        }
    },

    syncModalBodyState() {
        const hasItemInfoOpen = Boolean(elements.itemInfoModal && !elements.itemInfoModal.classList.contains("hidden"));
        const hasMenuImageOpen = Boolean(elements.menuImageModal && !elements.menuImageModal.classList.contains("hidden"));
        document.body.classList.toggle("modal-open", hasItemInfoOpen || hasMenuImageOpen);
    },

    applyMenuImageTransform() {
        if (!elements.menuImagePreview) return;
        const scale = Number(this.menuImageZoomScale || 1);
        const tx = Number(this.menuImagePanX || 0).toFixed(2);
        const ty = Number(this.menuImagePanY || 0).toFixed(2);
        elements.menuImagePreview.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    },

    getMenuImageMotionMaxPan() {
        const zoomFactor = Math.max(0, Number(this.menuImageZoomScale || 1) - 1);
        const pan = zoomFactor * 64;
        return Math.min(MENU_IMAGE_MOTION_MAX_PAN, Math.max(0, pan));
    },

    handleMenuImageOrientation(event) {
        if (!elements.menuImageModal || elements.menuImageModal.classList.contains("hidden")) return;
        if (this.menuImageZoomScale <= MENU_IMAGE_ZOOM_MIN + 0.001) return;

        const beta = Number(event?.beta);
        const gamma = Number(event?.gamma);
        if (!Number.isFinite(beta) || !Number.isFinite(gamma)) return;

        if (this.menuImageMotionBaseline.beta === null || this.menuImageMotionBaseline.gamma === null) {
            this.menuImageMotionBaseline = { beta, gamma };
            return;
        }

        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const betaDelta = clamp(beta - this.menuImageMotionBaseline.beta, -MENU_IMAGE_MOTION_TILT_LIMIT, MENU_IMAGE_MOTION_TILT_LIMIT);
        const gammaDelta = clamp(gamma - this.menuImageMotionBaseline.gamma, -MENU_IMAGE_MOTION_TILT_LIMIT, MENU_IMAGE_MOTION_TILT_LIMIT);
        const maxPan = this.getMenuImageMotionMaxPan();

        this.menuImagePanX = clamp(gammaDelta * MENU_IMAGE_MOTION_PAN_FACTOR, -maxPan, maxPan);
        this.menuImagePanY = clamp(betaDelta * MENU_IMAGE_MOTION_PAN_FACTOR * -1, -maxPan, maxPan);
        this.applyMenuImageTransform();
    },

    async ensureMenuImageMotionTracking() {
        if (typeof window === "undefined") return false;
        if (this.menuImageMotionPermissionState === "unsupported" || this.menuImageMotionPermissionState === "denied") {
            return false;
        }

        const orientationCtor = window.DeviceOrientationEvent;
        if (!orientationCtor) {
            this.menuImageMotionPermissionState = "unsupported";
            return false;
        }

        if (this.menuImageMotionPermissionState === "idle" && typeof orientationCtor.requestPermission === "function") {
            try {
                const permission = await orientationCtor.requestPermission();
                if (permission !== "granted") {
                    return false;
                }
            } catch {
                return false;
            }
        }

        if (this.menuImageMotionPermissionState === "idle") {
            this.menuImageMotionPermissionState = "granted";
        }

        if (this.menuImageMotionActive) return true;

        this.menuImageMotionBaseline = { beta: null, gamma: null };
        this.menuImageOrientationHandler = (event) => this.handleMenuImageOrientation(event);
        window.addEventListener("deviceorientation", this.menuImageOrientationHandler, { passive: true });
        this.menuImageMotionActive = true;
        return true;
    },

    stopMenuImageMotionTracking(options = {}) {
        if (this.menuImageMotionActive && this.menuImageOrientationHandler) {
            window.removeEventListener("deviceorientation", this.menuImageOrientationHandler);
        }

        this.menuImageMotionActive = false;
        this.menuImageOrientationHandler = null;
        this.menuImageMotionBaseline = { beta: null, gamma: null };

        if (options.resetPan === true) {
            this.menuImagePanX = 0;
            this.menuImagePanY = 0;
        }
    },

    setMenuImageZoom(nextScale) {
        const clamped = Math.min(MENU_IMAGE_ZOOM_MAX, Math.max(MENU_IMAGE_ZOOM_MIN, Number(nextScale) || 1));
        this.menuImageZoomScale = clamped;

        if (clamped <= MENU_IMAGE_ZOOM_MIN + 0.001) {
            this.stopMenuImageMotionTracking({ resetPan: true });
        } else {
            void this.ensureMenuImageMotionTracking();
        }

        if (elements.menuImagePreview) {
            this.applyMenuImageTransform();
            elements.menuImagePreview.style.cursor = clamped > MENU_IMAGE_ZOOM_MIN ? "zoom-out" : "zoom-in";
        }
        if (elements.menuImageZoomLabel) {
            elements.menuImageZoomLabel.textContent = `${Math.round(clamped * 100)}%`;
        }
        if (elements.menuImageZoomIn) {
            elements.menuImageZoomIn.disabled = clamped >= MENU_IMAGE_ZOOM_MAX;
        }
        if (elements.menuImageZoomOut) {
            elements.menuImageZoomOut.disabled = clamped <= MENU_IMAGE_ZOOM_MIN;
        }
    },

    openMenuImageModal(mealId) {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Only students can zoom menu images.", "error");
            return;
        }

        const item = MenuService.getById(mealId);
        if (!item?.imageUrl) {
            Helpers.setMessage(elements.orderMessage, "No image available for this item.", "error");
            return;
        }

        if (!elements.menuImageModal || !elements.menuImagePreview || !elements.menuImageTitle) {
            window.open(item.imageUrl, "_blank");
            return;
        }

        elements.menuImageTitle.textContent = `${item.name} Image`;
        elements.menuImagePreview.src = item.imageUrl;
        elements.menuImagePreview.alt = `${item.name} image`;
        this.setMenuImageZoom(1);
        elements.menuImageModal.classList.remove("hidden");
        this.syncModalBodyState();
    },

    closeMenuImageModal() {
        if (!elements.menuImageModal) return;
        elements.menuImageModal.classList.add("hidden");
        this.stopMenuImageMotionTracking({ resetPan: true });
        if (elements.menuImagePreview) {
            elements.menuImagePreview.style.transform = "translate(0px, 0px) scale(1)";
            elements.menuImagePreview.src = "";
        }
        this.setMenuImageZoom(1);
        this.syncModalBodyState();
    },

    openItemInfoEditorModal(initialValues = {}, options = {}) {
        if (!elements.itemInfoModal || !elements.itemInfoModalTitle || !elements.itemInfoModalContent || !elements.itemInfoModalActions) {
            return Promise.resolve({ ok: false, cancelled: true, message: "Item info dialog is unavailable." });
        }

        const previousResolver = this.itemInfoModalResolver;
        if (typeof previousResolver === "function") {
            this.itemInfoModalResolver = null;
            previousResolver({ ok: false, cancelled: true, message: "Item info input cancelled." });
        }

        return new Promise((resolve) => {
            this.itemInfoModalResolver = resolve;

            const mode = String(options.mode || "add").toLowerCase() === "edit" ? "edit" : "add";
            const nameValue = Helpers.escapeHtml(String(initialValues.name || ""));
            const hasPrice = String(initialValues.price ?? "").trim() !== "";
            const priceValue = hasPrice ? String(Helpers.parsePrice(initialValues.price)) : "";
            const imageValue = Helpers.escapeHtml(String(initialValues.imageUrl || ""));
            const categoryValue = Helpers.escapeHtml(Helpers.normalizeCategory(initialValues.category) || "Food");
            const nutritionValue = Helpers.escapeHtml(String(initialValues.nutrition || ""));
            const descriptionValue = Helpers.escapeHtml(String(initialValues.description || ""));

            elements.itemInfoModalTitle.textContent = mode === "edit" ? "Update Item Information" : "Add Item Information";
            elements.itemInfoModalContent.innerHTML = `
                <div class="item-info-editor">
                    <label class="field-label" for="item-info-editor-name">Item Name</label>
                    <input id="item-info-editor-name" type="text" value="${nameValue}" placeholder="Enter item name">

                    <label class="field-label" for="item-info-editor-price">Price</label>
                    <input id="item-info-editor-price" type="number" min="0" step="0.01" value="${Helpers.escapeHtml(priceValue)}" placeholder="0.00">

                    <label class="field-label" for="item-info-editor-image">Image URL</label>
                    <input id="item-info-editor-image" type="url" value="${imageValue}" placeholder="https://example.com/food.jpg">

                    <label class="field-label" for="item-info-editor-category">Category</label>
                    <input id="item-info-editor-category" type="text" value="${categoryValue}" placeholder="Drinks, Food, Snack, Kakanin">

                    <label class="field-label" for="item-info-editor-nutrition">Nutritional Value</label>
                    <input id="item-info-editor-nutrition" type="text" value="${nutritionValue}" placeholder="e.g. 250 kcal | P 10g | C 30g | F 8g">

                    <label class="field-label" for="item-info-editor-description">Description</label>
                    <textarea id="item-info-editor-description" placeholder="Describe the item...">${descriptionValue}</textarea>
                </div>
            `;
            elements.itemInfoModalActions.innerHTML = `
                <button type="button" class="btn btn-secondary" id="item-info-cancel-btn">Cancel</button>
                <button type="button" class="btn btn-primary" id="item-info-save-btn">Save Item Info</button>
            `;
            Helpers.setMessage(elements.itemInfoModalMessage, "");
            this.openItemInfoModal();

            const nameInput = document.getElementById("item-info-editor-name");
            const priceInput = document.getElementById("item-info-editor-price");
            const imageInput = document.getElementById("item-info-editor-image");
            const categoryInput = document.getElementById("item-info-editor-category");
            const nutritionInput = document.getElementById("item-info-editor-nutrition");
            const descriptionInput = document.getElementById("item-info-editor-description");
            const cancelBtn = document.getElementById("item-info-cancel-btn");
            const saveBtn = document.getElementById("item-info-save-btn");

            cancelBtn?.addEventListener("click", () => {
                this.closeItemInfoModal({ ok: false, cancelled: true, message: "Item info input cancelled." });
            }, { once: true });

            saveBtn?.addEventListener("click", () => {
                const name = String(nameInput?.value || "").trim();
                const priceRaw = String(priceInput?.value || "").trim();
                const imageUrl = String(imageInput?.value || "").trim();
                const category = Helpers.normalizeCategory(categoryInput?.value || "");
                const nutrition = String(nutritionInput?.value || "").trim();
                const description = String(descriptionInput?.value || "").trim();
                const price = Helpers.parsePrice(priceRaw);

                if (!name) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Item name is required.", "error");
                    return;
                }
                if (priceRaw === "") {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Price is required.", "error");
                    return;
                }
                if (!Number.isFinite(price) || price < 0) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Price must be a valid number.", "error");
                    return;
                }
                if (imageUrl && !Helpers.safeImageUrl(imageUrl)) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Image must be a valid URL or local path.", "error");
                    return;
                }
                if (!category) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Category is required.", "error");
                    return;
                }
                if (!nutrition) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Nutritional value is required.", "error");
                    return;
                }
                if (!description) {
                    Helpers.setMessage(elements.itemInfoModalMessage, "Description is required.", "error");
                    return;
                }

                this.closeItemInfoModal({
                    ok: true,
                    payload: {
                        name,
                        price,
                        imageUrl,
                        category,
                        nutrition,
                        description
                    }
                });
            });
        });
    },

    renderOrderSelect() {
        if (!elements.orderMeal) return;

        if (!RoleGuard.isStudent()) {
            elements.orderMeal.innerHTML = `<option value="">Staff accounts are not allowed to place reservations</option>`;
            elements.orderMeal.disabled = true;
            elements.orderQuantity.disabled = true;
            return;
        }

        const options = MenuService.getMenu()
            .filter((item) => item.availability === "Available")
            .map((item) => `<option value="${Helpers.escapeHtml(item.id)}">${Helpers.escapeHtml(item.name)} - ${Helpers.formatPrice(item.price)}</option>`)
            .join("");

        if (!options) {
            elements.orderMeal.innerHTML = `<option value="">No available meals</option>`;
            elements.orderMeal.disabled = true;
            elements.orderQuantity.disabled = true;
            return;
        }

        elements.orderMeal.innerHTML = options;
        elements.orderMeal.disabled = false;
        elements.orderQuantity.disabled = false;
    },

    handleOrderFormSubmit() {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error");
            return;
        }

        if (elements.orderMeal.disabled) {
            Helpers.setMessage(elements.orderMessage, "No available meals to reserve right now.", "error");
            return;
        }

        const payload = {
            mealId: elements.orderMeal.value,
            quantity: Number.parseInt(elements.orderQuantity.value, 10)
        };

        const validationError = ValidationService.validateOrder(payload);
        if (validationError) {
            Helpers.setMessage(elements.orderMessage, validationError, "error");
            return;
        }

        this.addToCart(payload.mealId, payload.quantity);
    },

    addToCart(mealId, quantity) {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error");
            return;
        }

        const meal = MenuService.getById(mealId);
        if (!meal) {
            Helpers.setMessage(elements.orderMessage, "Selected item is not available.", "error");
            return;
        }
        if (meal.availability !== "Available") {
            Helpers.setMessage(
                elements.orderMessage,
                "This item is out of stock and cannot be added to cart.",
                "error",
                {
                    toastTitle: "Out of Stock",
                    toastForce: true
                }
            );
            return;
        }

        const qty = Number.parseInt(quantity, 10);
        if (!Number.isInteger(qty) || qty < 1) {
            Helpers.setMessage(elements.orderMessage, "Quantity must be at least 1.", "error");
            return;
        }

        const existing = state.cart.find((entry) => entry.mealId === mealId);
        if (existing) {
            existing.quantity += qty;
        } else {
            state.cart.push({ mealId, quantity: qty });
        }

        if (elements.orderQuantity) {
            elements.orderQuantity.value = "1";
        }
        this.renderCart();
        Helpers.setMessage(elements.orderMessage, `${meal.name} added to your reserve.`, "success");
    },

    adjustCartItem(mealId, delta) {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error");
            return;
        }

        const item = state.cart.find((entry) => entry.mealId === mealId);
        if (!item) return;

        if (delta > 0) {
            const menuItem = MenuService.getById(mealId);
            if (!menuItem || menuItem.availability !== "Available") {
                Helpers.setMessage(
                    elements.orderMessage,
                    "Item is out of stock and cannot be added to cart.",
                    "error",
                    {
                        toastTitle: "Out of Stock",
                        toastForce: true
                    }
                );
                return;
            }
        }

        item.quantity += delta;
        if (item.quantity <= 0) {
            state.cart = state.cart.filter((entry) => entry.mealId !== mealId);
        }
        this.renderCart();
    },

    getCartSummary() {
        const menuById = new Map(MenuService.getMenu().map((item) => [item.id, item]));
        let totalItems = 0;
        let totalPrice = 0;
        const validEntries = [];

        const merged = new Map();
        for (const entry of state.cart) {
            const mealId = String(entry?.mealId || "");
            const quantity = Number.parseInt(entry?.quantity, 10);
            if (!mealId || !Number.isInteger(quantity) || quantity < 1) continue;
            merged.set(mealId, (merged.get(mealId) || 0) + quantity);
        }

        for (const [mealId, quantity] of merged.entries()) {
            const menuItem = menuById.get(mealId);
            if (!menuItem) continue;

            const lineTotal = Number(menuItem.price) * quantity;
            totalItems += quantity;
            totalPrice += lineTotal;
            validEntries.push({ mealId, quantity, meal: menuItem, lineTotal });
        }

        state.cart = validEntries.map((entry) => ({ mealId: entry.mealId, quantity: entry.quantity }));
        return { totalItems, totalPrice, lines: validEntries };
    },

    syncPaymentControls(options = {}) {
        const disabled = Boolean(options.disabled);
        const method = Helpers.normalizePaymentMethod(state.checkoutPaymentMethod);
        state.checkoutPaymentMethod = method;
        state.gcashReference = "";

        if (elements.currentPaymentMethod) {
            elements.currentPaymentMethod.value = method;
            elements.currentPaymentMethod.disabled = disabled;
        }

        const showGcashQr = !disabled && method === "GCash";
        if (elements.currentGcashQrPanel) {
            elements.currentGcashQrPanel.classList.toggle("hidden", !showGcashQr);
        }

        if (elements.currentGcashQrImage) {
            elements.currentGcashQrImage.setAttribute("aria-hidden", showGcashQr ? "false" : "true");
        }
    },

    renderCart() {
        if (!RoleGuard.isStudent()) {
            elements.currentOrdersCount.textContent = "0";
            elements.currentOrdersList.innerHTML = "";
            elements.currentOrdersEmpty.classList.remove("hidden");
            elements.currentOrdersTotal.textContent = Helpers.formatPrice(0);
            elements.currentCheckoutBtn.disabled = true;
            elements.currentClearBtn.disabled = true;
            this.syncPaymentControls({ disabled: true });
            return;
        }

        this.syncPaymentControls({ disabled: false });
        const summary = this.getCartSummary();
        elements.currentOrdersCount.textContent = String(summary.totalItems);
        elements.currentOrdersTotal.textContent = Helpers.formatPrice(summary.totalPrice);

        if (summary.lines.length === 0) {
            elements.currentOrdersList.innerHTML = "";
            elements.currentOrdersEmpty.classList.remove("hidden");
            elements.currentCheckoutBtn.disabled = true;
            elements.currentClearBtn.disabled = true;
            return;
        }

        elements.currentOrdersEmpty.classList.add("hidden");
        elements.currentCheckoutBtn.disabled = false;
        elements.currentClearBtn.disabled = false;

        elements.currentOrdersList.innerHTML = summary.lines
            .map((line) => {
                const outOfStock = line.meal.availability !== "Available";
                return `
                
                    <article class="current-order-card">
                        <div class="current-order-top">
                            <div>
                                <p class="current-order-name">${Helpers.escapeHtml(line.meal.name)}</p>
                                <p class="current-order-sub">${Helpers.formatPrice(line.meal.price)} x ${line.quantity}</p>
                            </div>
                            <div class="current-order-qty-controls">
                                <button type="button" class="qty-btn qty-btn-minus" data-action="qty-minus" data-meal-id="${Helpers.escapeHtml(line.mealId)}">-</button>
                                <span class="current-order-qty">${line.quantity}</span>
                                <button
                                    type="button"
                                    class="qty-btn qty-btn-plus"
                                    data-action="qty-plus"
                                    data-meal-id="${Helpers.escapeHtml(line.mealId)}"
                                    ${outOfStock ? "disabled" : ""}
                                >
                                    +
                                </button>
                            </div>
                            <p class="current-order-line-total">${Helpers.formatPrice(line.lineTotal)}</p>
                        </div>
                    </article>
                `;
            })
            .join("");
    },

    clearCart() {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error");
            return;
        }

        state.cart = [];
        this.renderCart();
        Helpers.setMessage(elements.orderMessage, "Cart cleared.", "success");
    },

    checkoutCart() {
        if (!RoleGuard.isStudent()) {
            Helpers.setMessage(elements.orderMessage, "Staff accounts are not allowed to place reservations.", "error");
            return;
        }

        const result = OrderService.placeFromCart(state.currentUser.id, state.cart, {
            paymentMethod: state.checkoutPaymentMethod,
            paymentReference: state.gcashReference
        });
        if (!result.ok) {
            Helpers.setMessage(elements.orderMessage, result.message, "error");
            return;
        }

        NotificationService.createStudentToStaff({
            senderId: state.currentUser.id,
            senderRole: ROLES.student,
            senderName: state.currentUser.fullName,
            createdCount: result.createdCount,
            paymentMethod: result.paymentMethod
        });

        state.cart = [];
        this.renderCart();
        this.renderOrders();

        const extra = result.blockedOutOfStock > 0 ? ` (${result.blockedOutOfStock} out-of-stock items skipped)` : "";
        Helpers.setMessage(
            elements.orderMessage,
            `Reservation placed successfully via ${result.paymentMethod}.${extra}`,
            "success"
        );
    },

    renderProfile() {
        if (!state.currentUser) return;

        const isStaff = state.currentUser.role === ROLES.staff;
        const roleLabel = isStaff ? i18n("role_staff", "Staff") : i18n("role_student", "Student");
        const studentOnlyFields = isStaff
            ? ""
            : `
                <div class="profile-item"><span>${Helpers.escapeHtml(i18n("profile_lrn", "LRN"))}</span><strong>${Helpers.escapeHtml(state.currentUser.idNumber)}</strong></div>
                <div class="profile-item"><span>${Helpers.escapeHtml(i18n("profile_grade_section", "Grade and Section"))}</span><strong>${Helpers.escapeHtml(state.currentUser.classDepartment)}</strong></div>
            `;

        elements.profileDisplay.innerHTML = `
            <div class="profile-item"><span>${Helpers.escapeHtml(i18n("profile_full_name", "Full Name"))}</span><strong>${Helpers.escapeHtml(state.currentUser.fullName)}</strong></div>
            ${studentOnlyFields}
            <div class="profile-item"><span>${Helpers.escapeHtml(i18n("profile_email", "Email"))}</span><strong>${Helpers.escapeHtml(state.currentUser.email)}</strong></div>
            <div class="profile-item"><span>${Helpers.escapeHtml(i18n("profile_role", "Role"))}</span><strong>${Helpers.escapeHtml(roleLabel)}</strong></div>
        `;

        if (elements.profileForm) {
            elements.profileForm.fullName.value = state.currentUser.fullName;
            elements.profileForm.idNumber.value = isStaff ? "" : state.currentUser.idNumber;
            elements.profileForm.classDepartment.value = isStaff ? "" : state.currentUser.classDepartment;
            elements.profileForm.email.value = state.currentUser.email;
            elements.profileForm.role.value = state.currentUser.role;
        }
    },

    showProfileEditor(visible) {
        // Profile editing is intentionally disabled (view-only profile).
        if (elements.profileForm) {
            elements.profileForm.classList.add("hidden");
            elements.profileForm.classList.remove("active");
        }
        if (elements.editProfileBtn) {
            elements.editProfileBtn.classList.add("hidden");
        }
        if (visible) {
            Helpers.setMessage(elements.profileMessage, "Profile editing is disabled.", "error");
            return;
        }
        Helpers.setMessage(elements.profileMessage, "");
    },

    handleProfileSubmit() {
        Helpers.setMessage(elements.profileMessage, "Profile editing is disabled.", "error");
    },

    async handlePasswordChangeSubmit() {
        if (!RoleGuard.isLoggedIn()) {
            Helpers.setMessage(elements.profileMessage, "Login is required.", "error");
            return;
        }
        if (!elements.settingsPasswordForm) return;

        const formData = new FormData(elements.settingsPasswordForm);
        const payload = {
            currentPassword: String(formData.get("currentPassword") || ""),
            newPassword: String(formData.get("newPassword") || ""),
            confirmPassword: String(formData.get("confirmPassword") || "")
        };

        this.showLoading(i18n("settings_password_submit", "Update Password"));
        try {
            const result = await AuthService.changePassword(payload);
            if (!result.ok) {
                Helpers.setMessage(elements.profileMessage, String(result.message || "Failed to update password."), "error");
                return;
            }

            elements.settingsPasswordForm.reset();
            Helpers.setMessage(elements.profileMessage, String(result.message || i18n("password_updated", "Password updated successfully.")), "success");
        } finally {
            this.hideLoading();
        }
    },

    async handleDeleteAccountSubmit() {
        if (!RoleGuard.isLoggedIn()) {
            Helpers.setMessage(elements.profileMessage, "Login is required.", "error");
            return;
        }
        if (!elements.settingsDeleteAccountForm) return;

        const formData = new FormData(elements.settingsDeleteAccountForm);
        const payload = {
            currentPassword: String(formData.get("currentPassword") || "")
        };

        const validationError = ValidationService.validateDeleteAccount(payload);
        if (validationError) {
            Helpers.setMessage(elements.profileMessage, validationError, "error");
            return;
        }

        const confirmed = window.confirm(
            i18n("settings_delete_account_confirm", "Are you sure you want to permanently delete your account?")
        );
        if (!confirmed) return;

        this.showLoading(i18n("settings_delete_account_submit", "Delete Account"));
        try {
            const result = await AuthService.deleteAccount(payload);
            if (!result.ok) {
                Helpers.setMessage(elements.profileMessage, String(result.message || "Failed to delete account."), "error");
                return;
            }

            elements.settingsDeleteAccountForm.reset();
            this.showAuthView();
            window.location.hash = "";
            Helpers.setMessage(
                elements.authMessage,
                String(result.message || i18n("delete_success", "Your account has been deleted.")),
                "success",
                { toast: false }
            );
        } finally {
            this.hideLoading();
        }
    },

    populateStaffGradeSectionFilter() {
        if (!elements.staffOrdersFilter) return;

        const previousValue = String(elements.staffOrdersFilter.value || "all").trim().toLowerCase();
        const options = [
            `<option value="all">${Helpers.escapeHtml(i18n("orders_filter_all", "All"))}</option>`,
            `<option value="grade-section">${Helpers.escapeHtml(i18n("orders_filter_grade_section", "Grade and Section"))}</option>`,
            `<option value="complete">${Helpers.escapeHtml(i18n("orders_filter_complete", "Complete"))}</option>`,
            `<option value="pending">${Helpers.escapeHtml(i18n("orders_filter_pending", "Pending"))}</option>`
        ];

        elements.staffOrdersFilter.innerHTML = options.join("");
        const allowedValues = new Set(["all", "grade-section", "complete", "pending"]);
        elements.staffOrdersFilter.value = allowedValues.has(previousValue) ? previousValue : "all";
    },

    renderOrders() {
        if (RoleGuard.isStaff()) {
            const allOrders = OrderService.getAll()
                .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
            const usersById = new Map(StorageService.getUsers().map((user) => [user.id, user]));
            const query = String(elements.staffOrdersSearch?.value || "").trim().toLowerCase();
            const showHistoryOrders = state.staffHistoryVisible === true;
            const noMatchMessage = i18n("orders_no_matching", "No matching student reservations.");

            elements.ordersTitle.textContent = i18n("orders_title_staff", "Student Reservations");
            elements.ordersSubtitle.textContent = i18n("orders_subtitle_staff", "View student orders, update status, and move hidden orders to history.");
            elements.staffOrdersTools?.classList.remove("hidden");
            elements.staffActiveTitle?.classList.remove("hidden");
            elements.staffCompletedTitle?.classList.remove("hidden");
            elements.staffActiveTitle.textContent = i18n("orders_student_list_title", "Pending Reservations");
            if (elements.staffCompletedTitle) {
                elements.staffCompletedTitle.textContent = i18n("orders_staff_completed_title", "Completed Reservations");
            }
            elements.staffHistoryTitle.textContent = i18n("orders_history_staff_title", "History Orders");
            if (elements.staffHistoryToggleBtn) {
                elements.staffHistoryToggleBtn.textContent = showHistoryOrders
                    ? i18n("orders_history_toggle_hide", "Hide History Orders")
                    : i18n("orders_history_toggle_show", "Show History Orders");
            }
            elements.staffHistoryTitle?.classList.toggle("hidden", !showHistoryOrders);
            elements.ordersHistoryList?.classList.toggle("hidden", !showHistoryOrders);
            if (!showHistoryOrders) {
                elements.ordersHistoryEmpty?.classList.add("hidden");
            }

            const decorated = allOrders.map((order) => {
                const student = usersById.get(order.userId);
                const studentName = student?.fullName || "Unknown Student";
                const studentLrn = student?.idNumber || "N/A";
                const studentGradeSection = String(student?.classDepartment || "").trim();
                const paymentMethod = Helpers.normalizePaymentMethod(order.paymentMethod);
                const dateLabel = Helpers.formatDateTime(order.placedAt);

                return {
                    order,
                    studentName,
                    studentLrn,
                    studentGradeSection,
                    paymentMethod,
                    dateLabel
                };
            });

            this.populateStaffGradeSectionFilter();
            const selectedFilter = String(elements.staffOrdersFilter?.value || "all").trim().toLowerCase();

            const filtered = decorated
                .filter((entry) => {
                    if (!query) return true;
                    const haystack = selectedFilter === "grade-section"
                        ? String(entry.studentGradeSection || "").toLowerCase()
                        : [
                            entry.studentName,
                            entry.studentLrn,
                            entry.studentGradeSection,
                            entry.order.mealName,
                            entry.order.status,
                            entry.paymentMethod,
                            entry.order.paymentReference || "",
                            entry.dateLabel
                        ]
                            .join(" ")
                            .toLowerCase();
                    return haystack.includes(query);
                })
                .filter((entry) => {
                    if (selectedFilter === "all" || selectedFilter === "grade-section") return true;
                    if (selectedFilter === "complete") return entry.order.status === "Completed";
                    if (selectedFilter === "pending") return entry.order.status !== "Completed";
                    return true;
                });

            const pendingOrders = filtered.filter((entry) => entry.order.hiddenByStaff !== true && entry.order.status !== "Completed");
            const completedOrders = filtered.filter((entry) => entry.order.hiddenByStaff !== true && entry.order.status === "Completed");
            const historyOrders = filtered.filter((entry) => entry.order.hiddenByStaff === true);
            const hasSearchOrFilter = Boolean(query) || selectedFilter === "complete" || selectedFilter === "pending";

            const renderStaffOrderCard = (entry, options = {}) => {
                const order = entry.order;
                const statusClass = order.status === "Completed" ? "status-completed" : "status-pending";
                const paymentReferenceLine = entry.paymentMethod === "GCash" && order.paymentReference
                    ? `<p>GCash Ref: ${Helpers.escapeHtml(order.paymentReference)}</p>`
                    : "";
                const actionParts = [];
                if (options.allowComplete === true && order.status !== "Completed") {
                    actionParts.push(`
                        <button
                            type="button"
                            class="btn btn-primary small-btn"
                            data-action="set-order-status"
                            data-order-id="${Helpers.escapeHtml(order.id)}"
                            data-status="Completed"
                        >
                            ${Helpers.escapeHtml(i18n("orders_action_mark_completed", "Mark Completed"))}
                        </button>
                    `);
                }
                if (options.allowHide === true && order.status === "Completed" && order.hiddenByStaff !== true) {
                    actionParts.push(`
                        <button
                            type="button"
                            class="btn btn-secondary small-btn"
                            data-action="toggle-order-hidden"
                            data-order-id="${Helpers.escapeHtml(order.id)}"
                        >
                            ${Helpers.escapeHtml(i18n("orders_action_hide", "Hide Order"))}
                        </button>
                    `);
                }
                const actionButtons = actionParts.length > 0
                    ? `<div class="order-actions">${actionParts.join("")}</div>`
                    : "";

                return `
                    <article class="order-card">
                        <div class="order-header">
                            <h4>${Helpers.escapeHtml(order.mealName)}</h4>
                            <span class="status-pill ${statusClass}">${Helpers.escapeHtml(order.status)}</span>
                        </div>
                        <p>Student: ${Helpers.escapeHtml(entry.studentName)} (LRN: ${Helpers.escapeHtml(entry.studentLrn)})</p>
                        <p>${Helpers.escapeHtml(i18n("profile_grade_section", "Grade and Section"))}: ${Helpers.escapeHtml(entry.studentGradeSection || "N/A")}</p>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Amount: ${Helpers.formatPrice(order.totalPrice)}</p>
                        <p>Payment: ${Helpers.escapeHtml(entry.paymentMethod)}</p>
                        ${paymentReferenceLine}
                        <p>Reserved at: ${Helpers.escapeHtml(entry.dateLabel)}</p>
                        ${actionButtons}
                    </article>
                `;
            };

            if (pendingOrders.length === 0) {
                elements.ordersList.innerHTML = "";
                elements.ordersEmpty.textContent = hasSearchOrFilter
                    ? noMatchMessage
                    : (allOrders.length === 0
                        ? i18n("orders_no_student", "No student reservations yet")
                        : i18n("orders_no_pending_student", "No pending student reservations."));
                elements.ordersEmpty.classList.remove("hidden");
            } else {
                elements.ordersEmpty.classList.add("hidden");
                elements.ordersList.innerHTML = pendingOrders
                    .map((entry) => renderStaffOrderCard(entry, { allowComplete: true }))
                .join("");
            }

            if (completedOrders.length === 0) {
                if (elements.ordersCompletedList) elements.ordersCompletedList.innerHTML = "";
                if (elements.ordersCompletedEmpty) {
                    elements.ordersCompletedEmpty.textContent = hasSearchOrFilter
                        ? noMatchMessage
                        : i18n("orders_no_completed_student", "No completed student reservations yet.");
                    elements.ordersCompletedEmpty.classList.remove("hidden");
                }
            } else {
                if (elements.ordersCompletedEmpty) elements.ordersCompletedEmpty.classList.add("hidden");
                if (elements.ordersCompletedList) {
                    elements.ordersCompletedList.innerHTML = completedOrders
                        .map((entry) => renderStaffOrderCard(entry, { allowHide: true }))
                        .join("");
                }
            }

            if (showHistoryOrders) {
                if (historyOrders.length === 0) {
                    elements.ordersHistoryList.innerHTML = "";
                    elements.ordersHistoryEmpty.textContent = hasSearchOrFilter
                        ? noMatchMessage
                        : i18n("orders_no_history_staff", "No history orders yet.");
                    elements.ordersHistoryEmpty.classList.remove("hidden");
                } else {
                    elements.ordersHistoryEmpty.classList.add("hidden");
                    elements.ordersHistoryList.innerHTML = historyOrders
                        .map((entry) => renderStaffOrderCard(entry))
                        .join("");
                }
            }

            return;
        }

        const orders = OrderService.getByUser(state.currentUser.id);
        const pendingOrders = orders.filter((order) => order.status !== "Completed");
        const completedOrders = orders.filter((order) => order.status === "Completed");

        elements.ordersTitle.textContent = i18n("orders_title_student", "Reservation History");
        elements.ordersSubtitle.textContent = i18n("orders_subtitle_student", "Review meal name, quantity, date and status.");
        elements.staffOrdersTools?.classList.add("hidden");
        elements.staffActiveTitle?.classList.remove("hidden");
        elements.staffCompletedTitle?.classList.remove("hidden");
        elements.staffHistoryTitle?.classList.add("hidden");
        elements.staffActiveTitle.textContent = i18n("orders_pending_title", "Pending Reservations");
        if (elements.staffCompletedTitle) {
            elements.staffCompletedTitle.textContent = i18n("orders_completed_title", "Completed Reservations");
        }
        elements.ordersHistoryList?.classList.add("hidden");
        if (elements.ordersHistoryEmpty) {
            elements.ordersHistoryEmpty.classList.add("hidden");
        }

        if (orders.length === 0) {
            elements.ordersList.innerHTML = "";
            if (elements.ordersCompletedList) elements.ordersCompletedList.innerHTML = "";
            elements.ordersHistoryList.innerHTML = "";
            elements.ordersEmpty.textContent = i18n("orders_no_orders", "No reservations yet");
            elements.ordersEmpty.classList.remove("hidden");
            if (elements.ordersCompletedEmpty) elements.ordersCompletedEmpty.classList.add("hidden");
            elements.ordersHistoryEmpty.classList.add("hidden");
            return;
        }

        if (pendingOrders.length === 0) {
            elements.ordersList.innerHTML = "";
            elements.ordersEmpty.textContent = i18n("orders_no_pending", "No pending reservations.");
            elements.ordersEmpty.classList.remove("hidden");
        } else {
            elements.ordersEmpty.classList.add("hidden");
            elements.ordersList.innerHTML = pendingOrders
                .map((order) => {
                const statusClass = order.status === "Completed" ? "status-completed" : "status-pending";
                const paymentMethod = Helpers.normalizePaymentMethod(order.paymentMethod);
                const paymentReferenceLine = paymentMethod === "GCash" && order.paymentReference
                    ? `<p>GCash Ref: ${Helpers.escapeHtml(order.paymentReference)}</p>`
                    : "";
                return `
                    <article class="order-card">
                        <div class="order-header">
                            <h4>${Helpers.escapeHtml(order.mealName)}</h4>
                            <span class="status-pill ${statusClass}">${Helpers.escapeHtml(order.status)}</span>
                        </div>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Amount: ${Helpers.formatPrice(order.totalPrice)}</p>
                        <p>Payment: ${Helpers.escapeHtml(paymentMethod)}</p>
                        ${paymentReferenceLine}
                        <p>Reserved at: ${Helpers.escapeHtml(Helpers.formatDateTime(order.placedAt))}</p>
                    </article>
                `;
            })
            .join("");
        }

        if (completedOrders.length === 0) {
            if (elements.ordersCompletedList) elements.ordersCompletedList.innerHTML = "";
            if (elements.ordersCompletedEmpty) {
                elements.ordersCompletedEmpty.textContent = i18n("orders_no_completed", "No completed reservations yet.");
                elements.ordersCompletedEmpty.classList.remove("hidden");
            }
        } else {
            if (elements.ordersCompletedEmpty) elements.ordersCompletedEmpty.classList.add("hidden");
            if (elements.ordersCompletedList) {
                elements.ordersCompletedList.innerHTML = completedOrders
                .map((order) => {
                const statusClass = "status-completed";
                const paymentMethod = Helpers.normalizePaymentMethod(order.paymentMethod);
                const paymentReferenceLine = paymentMethod === "GCash" && order.paymentReference
                    ? `<p>GCash Ref: ${Helpers.escapeHtml(order.paymentReference)}</p>`
                    : "";
                return `
                    <article class="order-card">
                        <div class="order-header">
                            <h4>${Helpers.escapeHtml(order.mealName)}</h4>
                            <span class="status-pill ${statusClass}">${Helpers.escapeHtml(order.status)}</span>
                        </div>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Amount: ${Helpers.formatPrice(order.totalPrice)}</p>
                        <p>Payment: ${Helpers.escapeHtml(paymentMethod)}</p>
                        ${paymentReferenceLine}
                        <p>Reserved at: ${Helpers.escapeHtml(Helpers.formatDateTime(order.placedAt))}</p>
                    </article>
                `;
            })
            .join("");
            }
        }
    },

    handleStaffOrderStatusUpdate(orderId, status) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.systemMessage, "Only Staff can update reservation status.", "error");
            return;
        }

        const result = OrderService.updateStatus(orderId, status);
        if (!result.ok) {
            Helpers.setMessage(elements.systemMessage, result.message, "error");
            return;
        }

        this.renderOrders();
        Helpers.setMessage(elements.systemMessage, `Reservation marked as ${result.order.status}.`, "success");
    },

    handleStaffOrderHiddenUpdate(orderId, shouldHide) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.systemMessage, "Only Staff can update reservation status.", "error");
            return;
        }
        if (shouldHide !== true) {
            Helpers.setMessage(elements.systemMessage, "Restoring history orders is disabled.", "error");
            return;
        }

        const targetOrder = OrderService.getAll().find((order) => order.id === orderId);
        if (!targetOrder) {
            Helpers.setMessage(elements.systemMessage, "Reservation not found.", "error");
            return;
        }
        if (targetOrder.status !== "Completed") {
            Helpers.setMessage(
                elements.systemMessage,
                i18n("orders_hide_requires_completed", "Only completed orders can be hidden."),
                "error"
            );
            return;
        }

        const result = OrderService.setHidden(orderId, shouldHide);
        if (!result.ok) {
            Helpers.setMessage(elements.systemMessage, result.message, "error");
            return;
        }

        this.renderOrders();
        Helpers.setMessage(elements.systemMessage, i18n("orders_hidden_success", "Order moved to History Orders."), "success");
    },

    renderManageCategoryOptions(menuItems = null) {
        if (!elements.menuCategoryList) return;

        const categories = MenuService.getCategories(menuItems);
        elements.menuCategoryList.innerHTML = categories
            .map((category) => `<option value="${Helpers.escapeHtml(category)}"></option>`)
            .join("");
    },

    resetManageMenuForm() {
        state.editingMenuId = "";
        elements.menuEditId.value = "";
        elements.manageMenuForm.reset();
        this.renderManageCategoryOptions();
        elements.menuItemName.value = "";
        elements.menuItemPrice.value = "";
        elements.menuItemImage.value = "";
        elements.menuItemCategory.value = MenuService.getCategories()[0] || "Food";
        elements.menuItemNutrition.value = "";
        elements.menuItemDescription.value = "";
        elements.menuSaveBtn.textContent = "Add Item";
        elements.menuCancelEditBtn.classList.add("hidden");
        Helpers.setMessage(elements.manageMenuMessage, "");
    },

    startMenuEdit(itemId) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.manageMenuMessage, "Only Staff can manage menu items.", "error");
            return;
        }

        const item = MenuService.getById(itemId);
        if (!item) {
            Helpers.setMessage(elements.manageMenuMessage, "Menu item not found.", "error");
            return;
        }

        state.editingMenuId = item.id;
        elements.menuEditId.value = item.id;
        elements.menuItemName.value = item.name;
        this.renderManageCategoryOptions();
        elements.menuItemCategory.value = item.category;
        elements.menuItemPrice.value = String(item.price);
        elements.menuItemImage.value = item.imageUrl || "";
        elements.menuItemNutrition.value = item.nutrition || "";
        elements.menuItemDescription.value = item.description || "";
        elements.menuSaveBtn.textContent = "Update Item";
        elements.menuCancelEditBtn.classList.remove("hidden");
        Helpers.setMessage(elements.manageMenuMessage, "Editing item. Save when done.", "success");
    },

    deleteMenuItem(itemId) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.manageMenuMessage, "Only Staff can manage menu items.", "error");
            return;
        }

        if (!window.confirm("Delete this menu item?")) return;
        const result = MenuService.remove(itemId);
        if (!result.ok) {
            Helpers.setMessage(elements.manageMenuMessage, result.message, "error");
            return;
        }

        state.cart = state.cart.filter((entry) => entry.mealId !== itemId);
        this.renderMenu();
        this.renderOrderSelect();
        this.renderCart();
        this.renderManageMenu();
        Helpers.setMessage(elements.manageMenuMessage, "Menu item deleted.", "success");
    },

    toggleMenuItem(itemId) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.manageMenuMessage, "Only Staff can manage menu items.", "error");
            return;
        }

        const result = MenuService.toggleAvailability(itemId);
        if (!result.ok) {
            Helpers.setMessage(elements.manageMenuMessage, result.message, "error");
            return;
        }

        this.renderMenu();
        this.renderOrderSelect();
        this.renderCart();
        this.renderManageMenu();
        Helpers.setMessage(elements.manageMenuMessage, "");
    },

    async handleManageMenuSubmit() {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.manageMenuMessage, "Only Staff can manage menu items.", "error");
            return;
        }

        const isEdit = Boolean(state.editingMenuId);
        const existingItem = isEdit ? MenuService.getById(state.editingMenuId) : null;
        if (isEdit && !existingItem) {
            Helpers.setMessage(elements.manageMenuMessage, "Menu item not found.", "error");
            return;
        }

        const formData = new FormData(elements.manageMenuForm);
        const payload = {
            name: String(formData.get("name") || ""),
            category: Helpers.normalizeCategory(formData.get("category")),
            price: Helpers.parsePrice(formData.get("price")),
            imageUrl: String(formData.get("imageUrl") || ""),
            nutrition: String(formData.get("nutrition") || "").trim(),
            description: String(formData.get("description") || "").trim(),
            availability: isEdit ? existingItem.availability : "Available"
        };

        const infoResult = await this.openItemInfoEditorModal(payload, { mode: isEdit ? "edit" : "add" });
        if (!infoResult.ok) {
            Helpers.setMessage(elements.manageMenuMessage, infoResult.cancelled ? "" : infoResult.message, infoResult.cancelled ? "" : "error");
            return;
        }

        payload.name = infoResult.payload.name;
        payload.price = infoResult.payload.price;
        payload.imageUrl = infoResult.payload.imageUrl;
        payload.category = infoResult.payload.category;
        payload.nutrition = infoResult.payload.nutrition;
        payload.description = infoResult.payload.description;

        elements.menuItemName.value = payload.name;
        elements.menuItemPrice.value = String(payload.price);
        elements.menuItemImage.value = payload.imageUrl;
        elements.menuItemCategory.value = payload.category;
        elements.menuItemNutrition.value = payload.nutrition;
        elements.menuItemDescription.value = payload.description;

        const result = isEdit ? MenuService.update(state.editingMenuId, payload) : MenuService.add(payload);
        if (!result.ok) {
            Helpers.setMessage(elements.manageMenuMessage, result.message, "error");
            return;
        }

        this.renderMenu();
        this.renderOrderSelect();
        this.renderCart();
        this.renderManageMenu();
        this.resetManageMenuForm();
        Helpers.setMessage(elements.manageMenuMessage, isEdit ? "Menu item updated." : "Menu item added.", "success");
    },

    renderManageMenu() {
        if (!RoleGuard.isStaff()) {
            elements.manageMenuList.innerHTML = "";
            return;
        }

        const menu = MenuService.getMenu();
        this.renderManageCategoryOptions(menu);
        const categories = MenuService.getCategories(menu);

        elements.manageMenuList.innerHTML = categories
            .map((category) => {
                const title = category === "Snack" ? "Snacks" : category;
                const items = menu.filter((item) => Helpers.normalizeCategory(item.category) === category);
                const cards = items
                    .map((item) => {
                        const image = item.imageUrl
                            ? `<img src="${Helpers.escapeHtml(item.imageUrl)}" alt="${Helpers.escapeHtml(item.name)}" class="manage-menu-thumb">`
                            : `<div class="manage-menu-thumb"></div>`;
                        const availabilityClass = item.availability === "Available" ? "availability-available" : "availability-out";
                        const toggleLabel = item.availability === "Available" ? "Out of Stock" : "Available";
                        const isOutOfStock = item.availability !== "Available";

                        return `
                            <article class="manage-menu-card ${isOutOfStock ? "manage-menu-card-out" : ""}">
                                <div class="manage-menu-top">
                                    ${image}
                                    <div>
                                        <p class="manage-menu-title">${Helpers.escapeHtml(item.name)}</p>
                                        <p class="manage-menu-sub">${Helpers.escapeHtml(item.category)} | ${Helpers.formatPrice(item.price)}</p>
                                        <span class="availability-badge ${availabilityClass}">${Helpers.escapeHtml(item.availability)}</span>
                                    </div>
                                </div>
                                <div class="manage-menu-actions">
                                    <button type="button" class="btn btn-secondary small-btn" data-action="edit-menu" data-item-id="${Helpers.escapeHtml(item.id)}">Edit</button>
                                    <button type="button" class="btn btn-maroon small-btn" data-action="toggle-menu" data-item-id="${Helpers.escapeHtml(item.id)}">${toggleLabel}</button>
                                    <button type="button" class="btn btn-secondary small-btn" data-action="delete-menu" data-item-id="${Helpers.escapeHtml(item.id)}">Delete</button>
                                </div>
                            </article>
                        `;
                    })
                    .join("");

                const content = cards || `<p class="muted-msg menu-manage-note">No items in this category yet.</p>`;
                return `
                    <section class="manage-menu-group">
                        <h4 class="meal-category-title manage-menu-group-title">${Helpers.escapeHtml(title)}</h4>
                        <div class="manage-menu-grid">
                            ${content}
                        </div>
                    </section>
                `;
            })
            .join("");
    },

    handleSuspensionAction(userId, action, payload = {}) {
        if (!RoleGuard.isStaff()) {
            Helpers.setMessage(elements.suspensionsMessage, i18n("suspensions_staff_only", "Only Staff can manage suspensions."), "error");
            return;
        }

        const users = StorageService.getUsers();
        const targetUser = users.find((entry) => String(entry?.id || "") === String(userId || ""));
        if (!targetUser || Helpers.normalizeRole(targetUser.role) !== ROLES.student) {
            Helpers.setMessage(elements.suspensionsMessage, "Student account not found.", "error");
            return;
        }

        const reason = String(payload?.reason || "");
        const durationValue = String(payload?.durationValue || "");
        const durationUnit = String(payload?.durationUnit || "");
        const actorId = String(state.currentUser?.id || "");

        let result = { ok: false, message: "Invalid suspension action." };
        if (action === "suspend-student") {
            result = SuspensionService.suspendStudent(
                userId,
                reason,
                durationValue,
                durationUnit,
                actorId
            );
            if (result.ok) {
                Helpers.setMessage(elements.suspensionsMessage, i18n("suspensions_success_suspend", "Student account suspended."), "success");
            }
        } else if (action === "adjust-suspension-duration") {
            result = SuspensionService.adjustSuspensionDuration(
                userId,
                durationValue,
                durationUnit,
                actorId
            );
            if (result.ok) {
                Helpers.setMessage(
                    elements.suspensionsMessage,
                    i18n("suspensions_success_adjust_duration", "Suspension duration updated."),
                    "success"
                );
            }
        } else if (action === "unsuspend-student") {
            result = SuspensionService.unsuspendStudent(
                userId,
                actorId
            );
            if (result.ok) {
                Helpers.setMessage(elements.suspensionsMessage, i18n("suspensions_success_unsuspend", "Student account unsuspended."), "success");
            }
        }

        if (!result.ok) {
            Helpers.setMessage(elements.suspensionsMessage, result.message || "Unable to update suspension status.", "error");
            return;
        }

        this.renderSuspensions();
    },

    toggleSuspensionSettings(card, toggleButton) {
        if (!card || !toggleButton) return;
        const settingsPanel = card.querySelector(".suspension-settings");
        if (!settingsPanel) return;

        const isHidden = settingsPanel.classList.contains("hidden");
        if (isHidden) {
            settingsPanel.classList.remove("hidden");
            toggleButton.textContent = i18n("suspensions_action_hide_settings", "Hide Suspension Settings");
            toggleButton.setAttribute("aria-expanded", "true");
            return;
        }

        settingsPanel.classList.add("hidden");
        toggleButton.textContent = i18n("suspensions_action_show_settings", "View Suspension Settings");
        toggleButton.setAttribute("aria-expanded", "false");
    },

    renderSuspensions() {
        if (!elements.suspensionsList || !elements.suspensionsEmpty) return;

        if (!RoleGuard.isStaff()) {
            elements.suspensionsList.innerHTML = "";
            elements.suspensionsEmpty.classList.add("hidden");
            return;
        }

        const students = StorageService.getUsers()
            .filter((entry) => Helpers.normalizeRole(entry?.role) === ROLES.student)
            .sort((a, b) => String(a?.fullName || "").localeCompare(String(b?.fullName || "")));

        if (students.length === 0) {
            elements.suspensionsList.innerHTML = "";
            elements.suspensionsEmpty.textContent = i18n("suspensions_empty", "No student accounts found.");
            elements.suspensionsEmpty.classList.remove("hidden");
            return;
        }

        const suspensionByUserId = new Map(
            SuspensionService.getAll().map((entry) => [String(entry.userId || ""), entry])
        );
        const searchInputValue = elements.suspensionsSearchInput
            ? String(elements.suspensionsSearchInput.value || "")
            : String(state.suspensionsSearch || "");
        const searchQuery = searchInputValue.trim().toLowerCase();
        state.suspensionsSearch = searchInputValue;
        if (elements.suspensionsSearchInput && elements.suspensionsSearchInput.value !== searchInputValue) {
            elements.suspensionsSearchInput.value = searchInputValue;
        }

        const filteredStudents = students.filter((student) => {
            if (!searchQuery) return true;
            const studentId = String(student?.id || "");
            const entry = suspensionByUserId.get(studentId) || null;
            const haystack = [
                String(student?.fullName || ""),
                String(student?.email || ""),
                String(student?.idNumber || ""),
                String(student?.classDepartment || ""),
                String(entry?.reason || "")
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(searchQuery);
        });

        if (filteredStudents.length === 0) {
            elements.suspensionsList.innerHTML = "";
            elements.suspensionsEmpty.textContent = i18n("suspensions_no_match", "No matching students found.");
            elements.suspensionsEmpty.classList.remove("hidden");
            return;
        }

        const hoursLabel = i18n("suspensions_duration_hours", "Hours").toLowerCase();
        const daysLabel = i18n("suspensions_duration_days", "Days").toLowerCase();
        const formatRemaining = (entry) => {
            const expiresAtMs = SuspensionService.toTimestamp(entry?.expiresAt);
            if (!expiresAtMs) return "";

            const remainingMs = expiresAtMs - Date.now();
            if (remainingMs <= 0) {
                return i18n("suspensions_remaining_expired", "Expired");
            }

            const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
            if (remainingHours >= 24) {
                const remainingDays = Math.ceil(remainingHours / 24);
                return `${remainingDays} ${daysLabel}`;
            }
            return `${remainingHours} ${hoursLabel}`;
        };

        const renderStudentCard = (student, entry) => {
            const studentId = String(student?.id || "");
            const fullName = String(student?.fullName || "").trim() || "Unknown Student";
            const email = String(student?.email || "").trim() || "N/A";
            const gradeSection = String(student?.classDepartment || "").trim() || "N/A";
            const isSuspended = Boolean(entry?.isSuspended === true);
            const statusClass = isSuspended ? "suspension-status-suspended" : "suspension-status-active";
            const statusText = isSuspended
                ? i18n("suspensions_status_suspended", "Suspended")
                : i18n("suspensions_status_active", "Active");
            const inputReason = isSuspended ? String(entry?.reason || "").trim() : "";
            const suspendedAtText = String(entry?.suspendedAt || "").trim();
            const expiresAtText = String(entry?.expiresAt || "").trim();
            const remainingText = isSuspended ? formatRemaining(entry) : "";

            const durationValueRaw = Number.parseInt(entry?.durationValue, 10);
            const durationValue = Number.isFinite(durationValueRaw) && durationValueRaw > 0
                ? durationValueRaw
                : 24;
            const durationUnit = String(entry?.durationUnit || "").trim().toLowerCase() === "days"
                ? "days"
                : "hours";

            const statusMetaParts = [];
            if (isSuspended && suspendedAtText) {
                statusMetaParts.push(
                    `<p class="suspension-meta">Suspended: ${Helpers.escapeHtml(Helpers.formatDateTime(suspendedAtText))}</p>`
                );
            }
            if (isSuspended && expiresAtText) {
                statusMetaParts.push(
                    `<p class="suspension-meta">${Helpers.escapeHtml(i18n("suspensions_expires_at", "Expires"))}: ${Helpers.escapeHtml(Helpers.formatDateTime(expiresAtText))}</p>`
                );
            }
            if (isSuspended && remainingText) {
                statusMetaParts.push(
                    `<p class="suspension-meta">${Helpers.escapeHtml(i18n("suspensions_remaining", "Remaining"))}: ${Helpers.escapeHtml(remainingText)}</p>`
                );
            }

            const actionButtons = isSuspended
                ? `
                    <button type="button" class="btn btn-maroon small-btn" data-action="adjust-suspension-duration" data-user-id="${Helpers.escapeHtml(studentId)}">${Helpers.escapeHtml(i18n("suspensions_action_adjust_duration", "Adjust Duration"))}</button>
                    <button type="button" class="btn btn-secondary small-btn" data-action="unsuspend-student" data-user-id="${Helpers.escapeHtml(studentId)}">${Helpers.escapeHtml(i18n("suspensions_action_unsuspend", "Unsuspend"))}</button>
                `
                : `
                    <button type="button" class="btn btn-maroon small-btn" data-action="suspend-student" data-user-id="${Helpers.escapeHtml(studentId)}">${Helpers.escapeHtml(i18n("suspensions_action_suspend", "Suspend"))}</button>
                `;

            return `
                <article class="suspension-card">
                    <div class="suspension-head">
                        <div class="suspension-basic">
                            <p class="suspension-name">${Helpers.escapeHtml(fullName)}</p>
                            <p class="suspension-meta">${Helpers.escapeHtml(email)}</p>
                            <p class="suspension-meta">${Helpers.escapeHtml(i18n("profile_grade_section", "Grade and Section"))}: ${Helpers.escapeHtml(gradeSection)}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="btn btn-secondary small-btn suspension-settings-toggle"
                        data-action="toggle-suspension-settings"
                        aria-expanded="false"
                    >
                        ${Helpers.escapeHtml(i18n("suspensions_action_show_settings", "View Suspension Settings"))}
                    </button>

                    <div class="suspension-settings hidden">
                        <div class="suspension-settings-status">
                            <span class="suspension-status ${statusClass}">${Helpers.escapeHtml(statusText)}</span>
                        </div>

                        <div class="suspension-settings-meta">
                            ${statusMetaParts.join("")}
                        </div>

                        <input
                            type="text"
                            class="suspension-reason-input"
                            value="${Helpers.escapeHtml(inputReason)}"
                            placeholder="${Helpers.escapeHtml(i18n("suspensions_reason_placeholder", "Reason for suspension (required)"))}"
                        >

                        <div class="suspension-duration-wrap">
                            <label class="field-label suspension-duration-label">${Helpers.escapeHtml(i18n("suspensions_duration_label", "Duration"))}</label>
                            <div class="suspension-duration-row">
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    class="suspension-duration-input"
                                    value="${Helpers.escapeHtml(String(durationValue))}"
                                >
                                <select class="suspension-duration-unit">
                                    <option value="hours" ${durationUnit === "hours" ? "selected" : ""}>${Helpers.escapeHtml(i18n("suspensions_duration_hours", "Hours"))}</option>
                                    <option value="days" ${durationUnit === "days" ? "selected" : ""}>${Helpers.escapeHtml(i18n("suspensions_duration_days", "Days"))}</option>
                                </select>
                            </div>
                        </div>

                        <div class="suspension-actions">
                            ${actionButtons}
                        </div>
                    </div>
                </article>
            `;
        };

        const suspendedStudents = [];
        const activeStudents = [];
        for (const student of filteredStudents) {
            const studentId = String(student?.id || "");
            const entry = suspensionByUserId.get(studentId) || null;
            if (entry?.isSuspended === true) {
                suspendedStudents.push({ student, entry });
            } else {
                activeStudents.push({ student, entry });
            }
        }

        const renderSection = (title, items, emptyText) => {
            const content = items.length > 0
                ? `
                    <div class="suspension-group-list">
                        ${items.map(({ student, entry }) => renderStudentCard(student, entry)).join("")}
                    </div>
                `
                : `<p class="muted-msg">${Helpers.escapeHtml(emptyText)}</p>`;

            return `
                <section class="suspension-group">
                    <h3 class="suspension-group-title">${Helpers.escapeHtml(title)}</h3>
                    ${content}
                </section>
            `;
        };

        elements.suspensionsEmpty.classList.add("hidden");
        elements.suspensionsList.innerHTML = `
            <div class="suspension-groups">
                ${renderSection(
                    i18n("suspensions_group_suspended", "Suspended Students"),
                    suspendedStudents,
                    i18n("suspensions_group_empty_suspended", "No suspended students.")
                )}
                ${renderSection(
                    i18n("suspensions_group_active", "Active Students"),
                    activeStudents,
                    i18n("suspensions_group_empty_active", "No active students.")
                )}
            </div>
        `;
    },

    submitSuggestion() {
        if (!RoleGuard.isLoggedIn()) {
            Helpers.setMessage(elements.suggestionMessage, "Please login first.", "error");
            return;
        }

        const result = SuggestionService.saveSuggestion({
            userId: state.currentUser.id,
            role: state.currentUser.role,
            fullName: state.currentUser.fullName,
            text: elements.suggestionInput.value
        });

        if (!result.ok) {
            Helpers.setMessage(elements.suggestionMessage, result.message, "error");
            return;
        }

        elements.suggestionInput.value = "";
        Helpers.setMessage(elements.suggestionMessage, "Suggestion submitted. Thank you.", "success");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    void UIController.init();
});
