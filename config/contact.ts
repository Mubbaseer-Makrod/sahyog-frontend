// config/contact.ts

export const contactConfig = {
  // WhatsApp Business Number (without + or country code prefix in the number itself)
  whatsappNumber: "91XXXXXXXXXX", // Replace with your actual number
  
  // Default WhatsApp Messages
  whatsappMessages: {
    general: "Hi, I am interested in your products and services.",
    productEnquiry: (productName: string) => 
      `Hi, I am interested in ${productName}. Can you please provide more details?`,
    tractorEnquiry: "Hi, I am looking for a tractor. Can you help me find the right one?",
    contactRequest: "Hi, I need assistance. Please contact me.",
  },
  
  // Contact Details
  phone: "+91 8780-573-189", // Replace with your formatted number
  email: "info@sahyogfarm.com",
  address: {
    street: "National Plaza, piraman road",
    city: "Ankleshwar",
    state: "Gujarat",
    pincode: "393001",
  },
  
  // Social Media (optional)
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  }
};

// Helper function to generate WhatsApp link
export const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
};