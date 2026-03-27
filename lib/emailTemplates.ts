/**
 * lib/emailTemplates.ts
 * Poora code bina kisi cut ke
 */

// Environment variable se domain lega, warna fallback use karega
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "https://meridians-education-website.vercel.app"; 
const LOGO_URL = `${DOMAIN}/logo.jpg`; 

// Social Media Links
const FB_LINK = "https://www.facebook.com/profile.php?id=100095628877699";
const INSTA_LINK = "https://www.instagram.com/meridiansgroupofeducation?fbclid=IwY2xjawQE3axleHRuA2FlbQIxMABicmlkETFCNFpOSkpGWTl0T3BpV1Myc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHkJyRYwruM-3xGA3And64ghDPul1SmynQzBc_quyxQfJSYloiZTvQV1bukE8_aem_fGucFZ_ObQnrUfSFN9a3sg";

// Theme Colors (OKLCH Approximation)
const COLORS = {
  primary: "#1c7a6b",   // Dark Teal
  secondary: "#3a632d", // Deep Forest Green
  accent: "#269987",    // Bright Teal
  bg: "#f8faf9",
  text: "#1a1a1a",
  muted: "#666666"
};

// Reusable Footer Component
const getFooter = () => `
  <div style="background-color: #ffffff; padding: 35px 20px; text-align: center; border-top: 1px solid #eeeeee;">
    <p style="color: ${COLORS.secondary}; font-size: 13px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.8px;">
      "WALIDAIN KA AITMAD, MERIDIANS KA MEYAR"
    </p>
    
    <div style="margin-bottom: 20px;">
      <a href="${FB_LINK}" style="text-decoration: none; margin: 0 15px; display: inline-block;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 30px; height: 30px;">
      </a>
      <a href="${INSTA_LINK}" style="text-decoration: none; margin: 0 15px; display: inline-block;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 30px; height: 30px;">
      </a>
    </div>

    <div style="margin-bottom: 25px;">
      <a href="${DOMAIN}" style="background-color: ${COLORS.primary}; color: #ffffff; padding: 12px 25px; text-decoration: none; font-size: 12px; border-radius: 6px; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
        Visit Our Website
      </a>
    </div>

    <p style="font-size: 11px; color: ${COLORS.muted}; line-height: 1.6; margin: 0;">
      &copy; 2026 Meridian's School System. All rights reserved.<br>
      <a href="${DOMAIN}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 600;">${DOMAIN.replace(/^https?:\/\//, '')}</a>
    </p>
  </div>
`;

// 1. CONTACT REPLY TEMPLATE
export function contactReplyTemplate({ name, reply }: { name: string; reply: string }) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: ${COLORS.bg}; padding: 30px 15px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
        
        <div style="background-color: ${COLORS.primary}; padding: 35px; text-align: center;">
          <div style="background: #ffffff; display: inline-block; padding: 12px; border-radius: 10px;">
            <img src="${LOGO_URL}" alt="Meridian's Logo" style="width: 130px; height: auto; display: block;">
          </div>
          <h1 style="color: #ffffff; font-size: 18px; margin-top: 15px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Help Desk Response</h1>
        </div>

        <div style="padding: 40px;">
          <p style="font-size: 16px; color: ${COLORS.text}; margin-bottom: 15px;">Dear <b>${name}</b>,</p>
          <div style="background-color: #f0fdfa; border-left: 4px solid ${COLORS.accent}; padding: 25px; border-radius: 4px; margin-bottom: 25px;">
            <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">${reply}</p>
          </div>
          <p style="font-size: 14px; color: ${COLORS.muted};">Best Regards,<br><span style="color: ${COLORS.primary}; font-weight: bold;">Meridian School Support</span></p>
        </div>

        ${getFooter()}
      </div>
    </div>
  `;
}

// 2. ADMISSION STATUS TEMPLATE
export function admissionStatusTemplate({ name, program, status }: { name: string; program: string; status: 'pending' | 'replied' }) {
  const isReplied = status === 'replied';
  const statusColor = isReplied ? COLORS.primary : "#ca8a04";
  const statusBg = isReplied ? "#f0fdfa" : "#fffbeb";
  
  return `
    <div style="font-family: Arial, sans-serif; background-color: ${COLORS.bg}; padding: 30px 15px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
        
        <div style="background-color: ${COLORS.secondary}; padding: 35px; text-align: center;">
          <div style="background: #ffffff; display: inline-block; padding: 12px; border-radius: 10px;">
            <img src="${LOGO_URL}" alt="Meridian's Logo" style="width: 130px; height: auto; display: block;">
          </div>
          <h1 style="color: #ffffff; font-size: 18px; margin-top: 15px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Admission Update</h1>
        </div>

        <div style="padding: 40px;">
          <p style="font-size: 16px; color: ${COLORS.text}; margin-bottom: 25px;">Respected Parent of <b>${name}</b>,</p>
          
          <div style="border: 2px dashed ${statusColor}; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; background-color: ${statusBg};">
            <span style="color: ${COLORS.muted}; font-size: 12px; text-transform: uppercase; font-weight: 600;">Program: ${program}</span>
            <h2 style="margin: 5px 0 0 0; color: ${statusColor}; font-size: 22px; font-weight: bold;">${isReplied ? 'Response Ready' : 'In Process'}</h2>
          </div>

          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            ${isReplied 
              ? `Thank you for choosing Meridian School. We have responded to your admission inquiry for <b>${program}</b>. Please visit our portal or reply to this mail to proceed with the next steps.` 
              : `Your inquiry for <b>${program}</b> has been received and is currently being reviewed by our admissions department. We will notify you as soon as the status changes.`}
          </p>
          
          <p style="font-size: 14px; color: ${COLORS.muted}; margin-top: 30px;">Kind Regards,<br><span style="color: ${COLORS.secondary}; font-weight: bold;">Meridian Admissions Office</span></p>
        </div>

        ${getFooter()}
      </div>
    </div>
  `;
}