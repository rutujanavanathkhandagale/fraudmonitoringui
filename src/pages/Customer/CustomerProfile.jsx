import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPersonalDetails,
  getAccountDetails,
  getKYCProfile,
  updatePersonalDetails,
  updateAccountDetails,
  saveKYCProfile
} from "../../services/Customer/api";

function CustomerProfile() {
  const { id } = useParams();
  const customerId = id;

  const [personal, setPersonal] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditPersonal, setShowEditPersonal] = useState(false);
  const [editAccountId, setEditAccountId] = useState(null);
  const [kycDocs, setKycDocs] = useState([]);

  const [showEditKYC, setShowEditKYC] = useState(false);

  const fetchProfile = async () => {
    try {
      const [personalRes, accountRes, kycRes] = await Promise.all([
        getPersonalDetails(customerId),
        getAccountDetails(customerId),
        getKYCProfile(customerId)
      ]);

      setPersonal(personalRes.data);
      const accData = accountRes.data;
      setAccounts(Array.isArray(accData) ? accData : [accData]);

      if (kycRes.data) {
        setKyc(kycRes.data);
        if (kycRes.data.documentRefsJSON) {
          try {
            setKycDocs(JSON.parse(kycRes.data.documentRefsJSON));
          } catch (err) {
            console.error("Error parsing KYC docs:", err);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching customer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchProfile();
    }
  }, [customerId]);

  if (loading) return <p style={styles.loading}>Loading profile...</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "#27ae60";
      case "Frozen": return "#f39c12";
      case "Closed": return "#c0392b";
      default: return "#7f8c8d";
    }
  };

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        FirstName: personal.firstName,
        MiddleName: personal.middleName,
        LastName: personal.lastName,
        FatherName: personal.fatherName,
        MotherName: personal.motherName,
        CustomerType: personal.customerType,
        Email: personal.email,
        Phone: personal.phone,
        DOB: personal.dob,
        PermanentAddress: personal.permanentAddress,
        CurrentAddress: personal.currentAddress,
        ProfileImagePath: personal.profileImagePath
      };
      await updatePersonalDetails(customerId, payload);
      setShowEditPersonal(false);
      fetchProfile();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleUpdateAccount = async (e, acc) => {
    e.preventDefault();
    try {
      const payload = {
        AccountNumber: acc.accountNumber,
        ProductType: acc.productType,
        Currency: acc.currency,
        Status: acc.status
      };
      await updateAccountDetails(acc.accountId, payload);
      setEditAccountId(null);
      fetchProfile();
    } catch (err) {
      console.error("Account update failed:", err);
    }
  };

  const handleUpdateKYC = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("customerId", personal.customerId);
      kycDocs.forEach(doc => {
        if (doc.newFile) {
          formData.append("documents", doc.newFile);
          formData.append("requiredDocs", doc.Type);
        }
      });
      await saveKYCProfile(formData);
      setShowEditKYC(false);
      fetchProfile();
    } catch (err) {
      console.error("KYC update failed:", err);
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      {personal && (
        <div style={styles.header}>
          <div style={styles.avatar}>
            <div style={styles.avatarPlaceholder}>
              {personal.firstName?.[0]}{personal.lastName?.[0]}
            </div>
          </div>

          <div style={styles.headerInfo}>
            <h2 style={styles.name}>
              {personal.firstName} {personal.middleName} {personal.lastName}
            </h2>
            <p style={styles.customerId}>Customer ID: {personal.customerId}</p>
            {kyc && (
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: kyc.status === "Verified" ? "#27ae60" : "#f39c12"
                }}
              >
                {kyc.status} KYC
              </span>
            )}
            {accounts.length > 0 && (
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: getStatusColor(accounts[0].status)
                }}
              >
                {accounts[0].status} Account
              </span>
            )}
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div style={styles.infoRow}>
        {/* Personal Information */}
        {personal && (
          <section style={styles.infoBox}>
            <div style={styles.sectionHeader}>
              <h3><span style={styles.icon}>👤</span> Personal Information</h3>
              <button
                style={styles.sectionEdit}
                title="Edit Personal Info"
                onClick={() => setShowEditPersonal(true)}
              >
                <span style={styles.pencilIcon}>✏️</span>
              </button>
            </div>

            {!showEditPersonal ? (
              <>
                <p><span style={styles.icon}>📧</span> <b>Email:</b> {personal.email}</p>
                <p><span style={styles.icon}>📞</span> <b>Phone:</b> {personal.phone}</p>
                <p><span style={styles.icon}>🎂</span> <b>Date of Birth:</b> {personal.dob}</p>
                <p><span style={styles.icon}>👨</span> <b>Father Name:</b> {personal.fatherName}</p>
                <p><span style={styles.icon}>👩</span> <b>Mother Name:</b> {personal.motherName}</p>
                <p><span style={styles.icon}>🧑‍💼</span> <b>Customer Type:</b> {personal.customerType}</p>
                <p><span style={styles.icon}>🏠</span> <b>Permanent Address:</b> {personal.permanentAddress}</p>
                <p><span style={styles.icon}>🏡</span> <b>Current Address:</b> {personal.currentAddress}</p>
              </>
            ) : (
              <form onSubmit={handleUpdatePersonal} style={styles.formLayout}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name:</label>
                  <input style={styles.input} value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Middle Name:</label>
                  <input style={styles.input} value={personal.middleName} onChange={(e) => setPersonal({ ...personal, middleName: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name:</label>
                  <input style={styles.input} value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email:</label>
                  <input style={styles.input} value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone:</label>
                  <input style={styles.input} value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>DOB:</label>
                  <input style={styles.input} value={personal.dob} onChange={(e) => setPersonal({ ...personal, dob: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Father Name:</label>
                  <input style={styles.input} value={personal.fatherName} onChange={(e) => setPersonal({ ...personal, fatherName: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mother Name:</label>
                  <input style={styles.input} value={personal.motherName} onChange={(e) => setPersonal({ ...personal, motherName: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Customer Type:</label>
                  <input style={styles.input} value={personal.customerType} onChange={(e) => setPersonal({ ...personal, customerType: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Permanent Address:</label>
                  <input style={styles.input} value={personal.permanentAddress} onChange={(e) => setPersonal({ ...personal, permanentAddress: e.target.value })} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Address:</label>
                  <input style={styles.input} value={personal.currentAddress} onChange={(e) => setPersonal({ ...personal, currentAddress: e.target.value })} />
                </div>
                <div style={styles.buttonRow}>
                  <button type="submit" style={styles.saveBtn}>Save</button>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowEditPersonal(false)}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* Account Information */}
        {accounts.length > 0 && (
          <section style={styles.infoBox}>
            <div style={styles.sectionHeader}>
              <h3><span style={styles.icon}>💳</span> Account Information</h3>
              <button
                style={styles.sectionEdit}
                title="Edit Account Info"
                onClick={() => setEditAccountId(accounts[0].accountId)}
              >
                <span style={styles.pencilIcon}>✏️</span>
              </button>
            </div>

            {accounts.map((acc, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                {editAccountId === acc.accountId ? (
                  <form
                    onSubmit={(e) => handleUpdateAccount(e, acc)}
                    style={styles.formLayout}
                  >
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Account Number:</label>
                      <input
                        style={styles.input}
                        value={acc.accountNumber}
                        onChange={(e) => {
                          const updated = [...accounts];
                          updated[index].accountNumber = e.target.value;
                          setAccounts(updated);
                        }}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Product Type:</label>
                      <input
                        style={styles.input}
                        value={acc.productType}
                        onChange={(e) => {
                          const updated = [...accounts];
                          updated[index].productType = e.target.value;
                          setAccounts(updated);
                        }}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Currency:</label>
                      <input
                        style={styles.input}
                        value={acc.currency}
                        onChange={(e) => {
                          const updated = [...accounts];
                          updated[index].currency = e.target.value;
                          setAccounts(updated);
                        }}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Status:</label>
                      <input
                        style={styles.input}
                        value={acc.status}
                        onChange={(e) => {
                          const updated = [...accounts];
                          updated[index].status = e.target.value;
                          setAccounts(updated);
                        }}
                      />
                    </div>
                    <div style={styles.buttonRow}>
                      <button type="submit" style={styles.saveBtn}>Save</button>
                      <button type="button" style={styles.cancelBtn} onClick={() => setEditAccountId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p><span style={styles.icon}>🔢</span> <b>Account Number:</b> {acc.accountNumber}</p>
                    <p><span style={styles.icon}>🏦</span> <b>Product Type:</b> {acc.productType}</p>
                    <p><span style={styles.icon}>💱</span> <b>Currency:</b> {acc.currency}</p>
                    <p>
                      <span style={styles.icon}>📊</span> <b>Status:</b>{" "}
                      <span style={{ ...styles.badge, backgroundColor: getStatusColor(acc.status) }}>
                        {acc.status}
                      </span>
                    </p>
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {/* KYC Information */}
        {kyc && (
          <section style={styles.kycBox}>
            <div style={styles.sectionHeader}>
              <h3><span style={styles.icon}>📑</span> KYC Verification Status</h3>
              <button
                style={styles.sectionEdit}
                title="Edit KYC Info"
                onClick={() => setShowEditKYC(true)}
              >
                <span style={styles.pencilIcon}>✏️</span>
              </button>
            </div>

            {!showEditKYC ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {kycDocs.map((doc, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <p>
                      <span style={styles.icon}>📄</span> <b>{doc.Type}:</b>{" "}
                      <span
                        style={{
                          color: kyc.status === "Verified" ? "#27ae60" : "#f39c12",
                          fontWeight: "bold"
                        }}
                      >
                        {kyc.status}
                      </span>
                    </p>
                    {doc.FilePath ? (
                      doc.FilePath.match(/\.(jpg|jpeg|png)$/i) ? (
                        <img
                          src={`https://localhost:7181${doc.FilePath}`}
                          alt={`${doc.Type} Document`}
                          style={{ width: "150px", borderRadius: "4px", marginTop: "8px" }}
                        />
                      ) : (
                        <a
                          href={`https://localhost:7181${doc.FilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#B51B75", fontWeight: "bold" }}
                        >
                          View {doc.Type} Document
                        </a>
                      )
                    ) : (
                      <span>No file uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <form
                onSubmit={handleUpdateKYC}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
              >
                {kycDocs.map((doc, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#B51B75", fontWeight: "bold" }}>{doc.Type}:</label>
                    {doc.FilePath && (
                      <div style={{ marginBottom: "8px" }}>
                        {doc.FilePath.match(/\.(jpg|jpeg|png)$/i) ? (
                          <img
                            src={`https://localhost:7181${doc.FilePath}`}
                            alt="current"
                            style={{ width: "60px", borderRadius: "4px" }}
                          />
                        ) : (
                          <span style={{ fontSize: "12px" }}>File exists</span>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      style={styles.input}
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const updated = [...kycDocs];
                        updated[index].newFile = file;
                        setKycDocs(updated);
                      }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / span 2", display: "flex", gap: "10px" }}>
                  <button type="submit" style={styles.saveBtn}>Save KYC Docs</button>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowEditKYC(false)}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "20px auto",
    backgroundColor: "#1F082A", 
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#ffffff"
  },

  header: { 
    display: "flex", 
    alignItems: "center", 
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)" 
  },
  
  avatar: { marginRight: "20px" },
  
  avatarPlaceholder: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6B1D4F 0%, #B51B75 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    boxShadow: "0 6px 14px rgba(181, 27, 117, 0.3)",
    border: "2px solid #fff"
  },

  headerInfo: { flex: 1 },
  name: { margin: "0", fontSize: "28px", color: "#ffffff", fontWeight: "bold" },
  customerId: { margin: "5px 0", color: "#94a3b8", fontWeight: "bold" },

  badge: {
    color: "white",
    padding: "4px 10px",
    borderRadius: "8px",
    marginRight: "6px",
    fontWeight: 600,
    fontSize: "0.75rem",
    textTransform: "uppercase"
  },

  infoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px"
  },

  infoBox: {
    padding: "20px",
    backgroundColor: "#250B33", 
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    color: "#ffffff"
  },

  kycBox: {
    gridColumn: "1 / span 2",
    padding: "20px",
    backgroundColor: "#250B33",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    color: "#ffffff"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    fontWeight: "bold",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "10px"
  },

  sectionEdit: { 
    background: "rgba(255, 255, 255, 0.05)", 
    border: "none", 
    cursor: "pointer",
    padding: "6px",
    borderRadius: "50%",
    display: "flex"
  },
  
  pencilIcon: { fontSize: "18px", color: "#B51B75" },
  icon: { marginRight: "10px", opacity: 0.8 },
  loading: { textAlign: "center", marginTop: "50px", fontSize: "18px", color: "#ffffff" },

  /* EDIT MODE STYLES */
  formLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },

  label: {
    fontSize: "12px",
    color: "#B51B75",
    fontWeight: "bold",
    marginLeft: "2px"
  },

  input: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none"
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "5px"
  },

  saveBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #6B1D4F 0%, #B51B75 100%)",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  cancelBtn: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default CustomerProfile;