export const tempPasswordEmailTemplate = (admin) => {
  return `
    <h2>Hello ${admin.name},</h2>

    <p>Your Super Admin has reset your account password.</p>

    <p><b>Here are your updated login details:</b></p>

    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr>
        <td style="padding: 6px 10px;"><b>Name:</b></td>
        <td style="padding: 6px 10px;">${admin.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 10px;"><b>Employee ID:</b></td>
        <td style="padding: 6px 10px;">${admin.emp_id}</td>
      </tr>
      <tr>
        <td style="padding: 6px 10px;"><b>Email:</b></td>
        <td style="padding: 6px 10px;">${admin.email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 10px;"><b>New Password:</b></td>
        <td style="padding: 6px 10px; font-weight: bold; color: #333;">${admin._tempPassword}</td>
      </tr>
    </table>

    <p style="margin-top: 15px;">
      Please login using the above password.  
      Although it's recommended to change your password, you may continue using this one unless instructed otherwise.
    </p>

    <p>If you did not request this reset, please contact support immediately.</p>

    <br/>
    <p>Best Regards,<br/>Your Team</p>
  `;
};
