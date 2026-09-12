/**
 * HISAB KITAB - Interactive Financial Dashboard Preview
 * Simulates dynamic accounting KPIs, Sales vs Purchase charts, and GST status
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardInteraction();
});

function initDashboardInteraction() {
  const timeButtons = document.querySelectorAll('.dash-time-btn');
  const chartBars = document.querySelectorAll('.chart-bar');
  const revenueVal = document.querySelector('#dashRevVal');
  const purchaseVal = document.querySelector('#dashPurchVal');
  const gstVal = document.querySelector('#dashGstVal');

  if (!timeButtons.length) return;

  const dataset = {
    '7d': {
      rev: '₹9,42,100',
      purch: '₹5,18,000',
      gst: '₹42,300',
      bars: [
        { sales: 45, purch: 30 },
        { sales: 70, purch: 45 },
        { sales: 60, purch: 40 },
        { sales: 90, purch: 55 },
        { sales: 75, purch: 50 },
        { sales: 95, purch: 60 }
      ]
    },
    '30d': {
      rev: '₹48,92,400',
      purch: '₹24,15,000',
      gst: '₹1,84,200',
      bars: [
        { sales: 60, purch: 40 },
        { sales: 85, purch: 55 },
        { sales: 70, purch: 48 },
        { sales: 110, purch: 72 },
        { sales: 95, purch: 65 },
        { sales: 135, purch: 88 }
      ]
    },
    'fy26': {
      rev: '₹4,12,80,000',
      purch: '₹2,35,40,000',
      gst: '₹16,90,500',
      bars: [
        { sales: 80, purch: 50 },
        { sales: 95, purch: 65 },
        { sales: 110, purch: 75 },
        { sales: 125, purch: 85 },
        { sales: 140, purch: 95 },
        { sales: 155, purch: 105 }
      ]
    }
  };

  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const data = dataset[period];
      if (!data) return;

      if (revenueVal) revenueVal.textContent = data.rev;
      if (purchaseVal) purchaseVal.textContent = data.purch;
      if (gstVal) gstVal.textContent = data.gst;

      // Animate chart bars
      const pairGroups = document.querySelectorAll('.chart-pair');
      pairGroups.forEach((pair, index) => {
        const salesBar = pair.querySelector('.chart-bar.sales');
        const purchBar = pair.querySelector('.chart-bar.purchase');
        if (salesBar && purchBar && data.bars[index]) {
          salesBar.style.height = `${data.bars[index].sales}px`;
          purchBar.style.height = `${data.bars[index].purch}px`;
        }
      });
    });
  });
}
