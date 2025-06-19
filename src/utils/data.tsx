export const bigHero6Data = [
  'water',
  'pedometer',
  'health',
  'motivation',
  'happiness',
  'meditation',
];

export const prompt = {
  joke: 'Tell me a relatable joke in two lines without using bold text.',
  motivation:
    'Tell me a relatable motivational quote in two lines without using bold text.',
  health: 'Give me heath tips in two lines without using bold text.',
};

export const WHATSAPP_MESSAGE = `✨ *Thank you for your purchase!* ✨

We truly appreciate your trust in us. Your order has been successfully processed. 🧾

Here is your _Invoice URL_:
🔗 *$$PDF_URL$$*

If you have any questions or need assistance, feel free to reach out. We're here to help!

_– from $$BUSINESS_NAME$$_`;

export const WHATSAPP_QUICK_ORDER_BY_QR_PROMO_MESSAGE = `🙏 *Welcome to $$BUSINESS_NAME$$!* 🇮🇳

🛒 *Shopping made super easy!*

📱 *Just scan this QR code* to:
1️⃣ Browse all our latest products  
2️⃣ Add your favourite items to cart  
3️⃣ Confirm your address & details  
4️⃣ ✅ Place your order in seconds!

💥 *No app needed* — works on any phone!  
🔒 100% safe, fast & hassle-free

🧾 Great prices • Fast service • Trusted seller

👇 Start shopping with *$$BUSINESS_NAME$$* now!`;


export interface OwnerPropertyObjType {
  id: number;
  key: string;
  title: string;
  description: string;
  default: boolean;
  editable: boolean;
  visibleTo: Array<'owner' | 'admin' | 'partner' | 'employee' | string>;
}


export const OWNER_PROPERTIES:{[key:string]:OwnerPropertyObjType} = {
  privateAccount: {
    id: 0,
    key: 'privateAccount',
    title: 'Private Account',
    description:
      "When enabled, only approved users can view this account's content and activity. This is typically used to maintain privacy for individual or business accounts that wish to limit exposure. It restricts profile visibility, post access, and other shared data from public access.",
    default: true,
    editable: true,
    visibleTo: ['owner', 'admin'],
  },
  accountDisabled: {
    id: 1,
    key: 'accountDisabled',
    title: 'Account Disabled',
    description:
      'Marks the account as inactive or deactivated. The user will no longer be able to sign in or access any features. This is usually set by the system admin in case of violations, inactivity, or manual disable requests. It effectively locks the profile and all associated data.',
    default: false,
    editable: true,
    visibleTo: ['admin'],
  },
  accessBusinessInfo: {
    id: 2,
    key: 'accessBusinessInfo',
    title: 'Business Info Access',
    description:
      'Grants permission to view business-related data such as company name, registration details, business sector, operating hours, and linked services. Useful for transparency and collaboration between verified partners or clients. This data may appear on public listings if enabled.',
    default: true,
    editable: true,
    visibleTo: ['owner', 'admin', 'partner'],
  },
  businessSearchable: {
    id: 3,
    key: 'businessSearchable',
    title: 'Business Searchable',
    description:
      'Allows the business account to be indexed in search results across the platform. When enabled, users can discover this profile via company name, location, category, or services offered. Disabling this will hide the business from all platform-wide searches.',
    default: true,
    editable: true,
    visibleTo: ['owner', 'admin'],
  },
  employeeSearchable: {
    id: 4,
    key: 'employeeSearchable',
    title: 'Employees Searchable',
    description:
      'Determines if employees linked to this business are visible in directory or platform search results. Helps clients and partners connect with team members, view their roles, and initiate communication. Useful for support, sales, and relationship management.',
    default: true,
    editable: true,
    visibleTo: ['owner', 'admin'],
  },
  partnerSearchable: {
    id: 5,
    key: 'partnerSearchable',
    title: 'Partner Searchable',
    description:
      'Controls whether associated or certified partner companies can be discovered through search and linked directories. When enabled, potential clients and collaborators can view and engage with official partners of this business. Disabling this hides partnership visibility.',
    default: false,
    editable: true,
    visibleTo: ['owner', 'admin'],
  },
};
