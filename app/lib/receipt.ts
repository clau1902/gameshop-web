import { jsPDF } from "jspdf";

interface OrderItem {
  id: string;
  gameId: string;
  gameTitle: string;
  storeName: string;
  price: string;
}

interface Order {
  id: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserInfo {
  name: string;
  email: string;
}

export function generateReceipt(order: Order, user: UserInfo): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [0, 217, 255]; // Cyan
  const textColor: [number, number, number] = [30, 30, 30];
  const mutedColor: [number, number, number] = [100, 100, 100];
  
  let yPos = 20;
  
  // Header background
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  // Logo and Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("GameVault", 20, 30);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.text("RECEIPT", pageWidth - 20, 30, { align: "right" });
  
  yPos = 70;
  
  // Receipt Info Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, yPos - 10, pageWidth - 30, 45, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.id, 55, yPos);
  
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 20, yPos);
  doc.setFont("helvetica", "normal");
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(orderDate, 55, yPos);
  
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Status:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(34, 197, 94); // Green
  doc.text(order.status.charAt(0).toUpperCase() + order.status.slice(1), 55, yPos);
  
  yPos += 10;
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.text("Payment:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1), 55, yPos);
  
  yPos += 25;
  
  // Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(user.name, 20, yPos);
  yPos += 6;
  doc.setTextColor(...mutedColor);
  doc.text(user.email, 20, yPos);
  
  yPos += 20;
  
  // Items Header
  doc.setFillColor(15, 17, 23);
  doc.rect(15, yPos - 5, pageWidth - 30, 12, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, yPos + 3);
  doc.text("Store", pageWidth / 2, yPos + 3);
  doc.text("Price", pageWidth - 25, yPos + 3, { align: "right" });
  
  yPos += 15;
  
  // Items
  doc.setTextColor(...textColor);
  order.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos - 5, pageWidth - 30, 12, "F");
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Truncate long titles
    const maxTitleLength = 35;
    const title = item.gameTitle.length > maxTitleLength 
      ? item.gameTitle.substring(0, maxTitleLength) + "..." 
      : item.gameTitle;
    
    doc.text(title, 20, yPos + 2);
    doc.setTextColor(...mutedColor);
    doc.text(item.storeName, pageWidth / 2, yPos + 2);
    doc.setTextColor(...textColor);
    doc.text(`$${parseFloat(item.price).toFixed(2)}`, pageWidth - 25, yPos + 2, { align: "right" });
    
    yPos += 12;
  });
  
  yPos += 5;
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);
  
  yPos += 15;
  
  // Totals
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text("Subtotal:", pageWidth - 70, yPos);
  doc.setTextColor(...textColor);
  doc.text(`$${parseFloat(order.totalAmount).toFixed(2)}`, pageWidth - 25, yPos, { align: "right" });
  
  yPos += 8;
  doc.setTextColor(...mutedColor);
  doc.text("Tax:", pageWidth - 70, yPos);
  doc.setTextColor(...textColor);
  doc.text("$0.00", pageWidth - 25, yPos, { align: "right" });
  
  yPos += 12;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - 90, yPos - 8, 75, 16, 2, 2, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", pageWidth - 85, yPos + 2);
  doc.text(`$${parseFloat(order.totalAmount).toFixed(2)}`, pageWidth - 25, yPos + 2, { align: "right" });
  
  yPos += 30;
  
  // Thank you message
  doc.setTextColor(...mutedColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your purchase!", pageWidth / 2, yPos, { align: "center" });
  
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Your games are ready to download from your library.", pageWidth / 2, yPos, { align: "center" });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 10, pageWidth - 15, footerY - 10);
  
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text("GameVault - Your Gaming Marketplace", pageWidth / 2, footerY, { align: "center" });
  doc.text("support@gamevault.com | www.gamevault.com", pageWidth / 2, footerY + 6, { align: "center" });
  
  // Save the PDF
  const fileName = `GameVault_Receipt_${order.id.slice(0, 8)}.pdf`;
  doc.save(fileName);
}

