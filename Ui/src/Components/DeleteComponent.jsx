import React from 'react';
import { Trash2, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfirmationToast = ({ 
  t, 
  title, 
  message, 
  type = 'delete',
  variant = 'danger',
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const getIconAndColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 size={16} color="#dc2626" />,
          bgColor: '#fee2e2',
          confirmBg: '#dc2626',
          confirmHover: '#b91c1c',
          confirmShadow: 'rgba(220, 38, 38, 0.2)',
          confirmHoverShadow: 'rgba(220, 38, 38, 0.4)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={16} color="#d97706" />,
          bgColor: '#fef3c7',
          confirmBg: '#d97706',
          confirmHover: '#b45309',
          confirmShadow: 'rgba(217, 119, 6, 0.2)',
          confirmHoverShadow: 'rgba(217, 119, 6, 0.4)'
        };
      case 'info':
        return {
          icon: <Info size={16} color="#2563eb" />,
          bgColor: '#dbeafe',
          confirmBg: '#2563eb',
          confirmHover: '#1d4ed8',
          confirmShadow: 'rgba(37, 99, 235, 0.2)',
          confirmHoverShadow: 'rgba(37, 99, 235, 0.4)'
        };
      default:
        return {
          icon: <HelpCircle size={16} color="#6b7280" />,
          bgColor: '#f3f4f6',
          confirmBg: '#6b7280',
          confirmHover: '#4b5563',
          confirmShadow: 'rgba(107, 114, 128, 0.2)',
          confirmHoverShadow: 'rgba(107, 114, 128, 0.4)'
        };
    }
  };

  const { icon, bgColor, confirmBg, confirmHover, confirmShadow, confirmHoverShadow } = getIconAndColors();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    toast.dismiss(t.id);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    toast.dismiss(t.id);
  };

  return (
    <div
      style={{
        display: "block",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
        color: "#1f2937",
        maxWidth: "360px",
        padding: "20px",
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(229, 231, 235, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Icon and Title */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#111827" }}>
            {title}
          </h4>
        </div>
      </div>

      {/* Message */}
      <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
        {message}
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <button
          onClick={handleCancel}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.transform = "translateY(0)";
          }}
          style={{
            backgroundColor: "#ffffff",
            color: "#374151",
            border: "1px solid #d1d5db",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = confirmHover;
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = `0 4px 12px ${confirmHoverShadow}`;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = confirmBg;
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = `0 2px 4px ${confirmShadow}`;
          }}
          style={{
            backgroundColor: confirmBg,
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: `0 2px 4px ${confirmShadow}`,
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

// Utility function to show confirmation toast
export const showConfirmationToast = ({
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  type = 'default',
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <ConfirmationToast
          t={t}
          title={title}
          message={message}
          type={type}
          variant={variant}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={() => {
            onConfirm();
            resolve(true);
          }}
          onCancel={() => {
            onCancel();
            resolve(false);
          }}
        />
      ),
      {
        duration: Infinity,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      }
    );
  });
};