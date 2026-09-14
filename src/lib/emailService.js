/**
 * Email Service Disabled
 * As per user requirements, all email notification features, Gmail SMTP, and nodemailer
 * background tasks have been completely deactivated.
 * Safe stub functions are preserved to prevent import breakage.
 */

export async function sendOrderNotificationEmail() {
  // Email notifications intentionally disabled
  return { success: true, disabled: true };
}

export async function sendOrderApprovedEmail() {
  // Email notifications intentionally disabled
  return { success: true, disabled: true };
}

export async function sendOrderRejectedEmail() {
  // Email notifications intentionally disabled
  return { success: true, disabled: true };
}
