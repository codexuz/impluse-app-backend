# Staff Attendance System - User Guide

This guide explains how the Staff Attendance system tracks teacher punctuality, manages fines for late arrivals, and utilizes the Telegram bot for automated check-ins.

---

## 1. Overview
The Staff Attendance system is designed to ensure teachers arrive on time for their scheduled lessons. It automatically calculates if a teacher is **Early**, **On Time**, or **Late** based on the group's starting time.

## 2. Ways to Mark Attendance

There are two primary ways to record attendance:

### A. Scanning a Group QR Code (Manual)
Teachers use the mobile app to scan a QR code specifically generated for their classroom or group.
1. **Teacher Action**: Open the app and scan the QR code displayed by the Admin.
2. **Selection**: Choose whether you are checking **IN** (arriving) or **OUT** (leaving).
3. **Outcome**: The system records your precise arrival time and compares it to the lesson start time.

### B. Telegram Bot Scanning (Automatic)
The school gatekeeper or administrator uses the official **Staff Attendance Bot**.
1. **Teacher Action**: Present your personal Teacher ID (QR code).
2. **Admin Action**: Scan the teacher's code using the Telegram Bot.
3. **Smart Matching**: The bot automatically:
    - Identifies which lesson the teacher has *right now*.
    - Toggles between **IN** and **OUT** (if you scanned "In" recently, the next scan is automatically "Out").
    - Confirms the record directly in the Telegram chat.

---

## 3. Punctuality & Fines

Fines are applied automatically to the teacher's wallet for **late arrivals (IN)**.

### Attendance Status Logic:
- **Early**: Arriving before the scheduled `lesson_start`.
- **On Time**: Arriving exactly at the scheduled time.
- **Late**: Arriving after the scheduled `lesson_start`.

### Fine Amounts:
If a teacher is late, the following fines are deducted from their wallet:
- **1 - 10 Minutes Late**: 100,000 UZS
- **11+ Minutes Late**: 200,000 UZS

> [!NOTE]
> Fines are only applied to **"IN"** scans. Clocking out late (leaving late) does not trigger a fine.

---

## 4. Wallet & Transactions
Every fine is recorded as a transaction in the system.
- **Transaction Type**: `jarima` (Fine).
- **Wallet Balance**: The fine is immediately deducted from the teacher's wallet. If the wallet doesn't have enough funds, it will enter a negative balance (debt).
- **History**: Teachers can view their attendance history and associated fines in their profile.

---

## 5. Security & Setup
For the Telegram Bot to work securely:
1. **Admin Authorization**: Only users whose Telegram accounts are linked in the database (via `telegram_chat_id`) can use the bot to scan teachers.
2. **Teacher ID**: Each teacher must have their unique User ID ready as a QR code or plain text to be scanned by the administrator.
