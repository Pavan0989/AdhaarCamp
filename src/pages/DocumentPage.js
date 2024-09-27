import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import itgLogo from "../images/itg_logo.jpg";
import govtLogo from "../images/govt_goa.jpg";
import html2pdf from "html2pdf.js";
import styles from "./DocumentPage.module.css"; // Import as CSS module

const DocumentPage = () => {
  const location = useLocation();
  const formData = location.state || JSON.parse(localStorage.getItem("formData")); // Fallback to localStorage

  useEffect(() => {
    if (!formData) {
      console.log("Form data is not available");
    } else {
      console.log("Form data loaded successfully:", formData);
    }
  }, [formData]);

  const handlePrint = () => {
    const element = document.querySelector(`.${styles.content}`); // Correct selector for CSS module
    const opt = {
      margin: [1, 1, 1, 1], // Adjust margins to fit header and footer
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, // Use CORS to handle images
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (!formData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className={styles["document-page"]}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <img src={itgLogo} alt="ITG Logo" />
          <div>
            <h1>Info Tech Corporation Of Goa Limited</h1>
            <p>(A Government of Goa Undertaking)</p>
            <p>(An ISO 9001: 2015 & ISO 27001:2013 Certified Company)</p>
          </div>
          <img src={govtLogo} alt="Goa Government Logo" />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles["letter-content"]}>
          <div className={styles["reference-date"]}>
            <p>Ref. No.: {formData.referenceNo || "ITG-IT/SW/0926/DPSE-EA-ITG/2022/"}</p>
            <p>Date: {formData.dated || "01.07.2024"}</p>
          </div>

          <div className={styles["letter-body"]}>
            <p>To,</p>
            <p>The Sarpanch,</p>
            <p>Office of Village Panchayat {formData.villagePanchayat || "Corlim"},</p>
            <p>{formData.taluka || "Tiswadi"}, Goa, {formData.pin || "403110"}</p>
            <p>
              Subject/Project: Conduct of Aadhaar Enrolment/Up-dation/Correction Camp in{" "}
              {formData.villagePanchayat || "Corlim"} Village Panchayat{" "}
              {formData.taluka || "Tiswadi"}, Goa.
            </p>
            <p>
              Order Ref. No.: {formData.orderReferenceNo || "VP/COR/F.Reply/2024-25/346"}{" "}
              dated {formData.dated || "24/06/2024"}
            </p>
            <p>Sir/Madam,</p>
            <p>
              Reference to the above subject, the following Data Entry Operator of this
              Corporation is hereby directed to attend Aadhaar Enrolment/Updation camp
              scheduled in the Office of Village Panchayat{" "}
              {formData.villagePanchayat || "Corlim"}, {formData.taluka || "Tiswadi"}, Goa.
              The timetable is as follows:
            </p>

            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Name of the Place and Taluka</th>
                  <th>Date</th>
                  <th>Name of the Data Entry Operators (DEO) of ITG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    Office of Village Panchayat {formData.villagePanchayat || "Corlim"},{" "}
                    {formData.taluka || "Tiswadi"}, Goa
                  </td>
                  <td>
                    {formData.fromDate} to {formData.toDate} ({formData.fromTime} to{" "}
                    {formData.toTime})
                  </td>
                  <td>
                    {formData.deoOfITG && formData.deoOfITG.length > 0
                      ? formData.deoOfITG.join(", ")
                      : "1. Mr. Prathamesh Parab, 2. Anushka Chari"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className={styles["letter-footer"]}>
            <p>This is for your information and necessary action.</p>
            <p>Thanking You,</p>
            <p>Yours Faithfully,</p>
            <p>(Sanesh Varghese)</p>
            <p>Manager (IT)</p>
          </div>

          <div className={styles["copy-to"]}>
            <p>Copy To:</p>
            <ol>
              <li>
                The Director, Directorate of Planning, Statistics & Evaluation (DPSE),
                Porvorim-Goa
              </li>
              <li>Office Copy</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>IT HUB 3rd Floor Altinho Panaji-Goa 403 001</p>
        <p>
          Email: <a href="mailto:md-itg.goa@nic.in">md-itg.goa@nic.in</a> | Telephone:
          0832-2226024/2224192
        </p>
        <p>Fax: 0832-2226707</p>
      </div>

      {/* Print Button */}
      <div className={styles["print-button"]}>
        <button onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
};

export default DocumentPage;
