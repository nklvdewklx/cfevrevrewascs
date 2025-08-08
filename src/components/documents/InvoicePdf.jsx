import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// CORRECTED: Using a standard, web-safe font to prevent loading errors.
Font.register({
    family: 'Helvetica',
});

// Create styles for the document
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoBox: {
        width: '45%',
    },
    table: {
        display: 'table',
        width: 'auto',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 8,
        borderBottom: '1px solid #bfbfbf',
        textAlign: 'left',
    },
    tableCellRight: {
        padding: 8,
        borderBottom: '1px solid #bfbfbf',
        textAlign: 'right',
    },
    col1: { width: '40%' },
    col2: { width: '20%' },
    col3: { width: '20%' },
    col4: { width: '20%' },
    footer: {
        marginTop: 20,
        textAlign: 'right',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    totalLabel: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    totalValue: {
        width: '20%',
        textAlign: 'right',
    }
});

const InvoicePdf = ({ invoice, order, customer, products }) => {
    if (!invoice || !order || !customer || !products) return null;

    const subtotal = order.items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return sum + (price * item.quantity);
    }, 0);

    const taxRate = 0.19; // Using a hardcoded tax rate for simplicity
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text>{invoice.invoiceNumber}</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>ROCTEC Inc.</Text>
                        <Text>Naaldwijk, South Holland</Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.subtitle}>BILL TO</Text>
                        <Text>{customer.name}</Text>
                        <Text>{customer.company}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={{ textAlign: 'right' }}>Issue Date: {invoice.issueDate}</Text>
                        <Text style={{ textAlign: 'right' }}>Due Date: {invoice.dueDate}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.col1]}>Description</Text>
                        <Text style={[styles.tableCell, styles.col2, { textAlign: 'right' }]}>Quantity</Text>
                        <Text style={[styles.tableCell, styles.col3, { textAlign: 'right' }]}>Unit Price</Text>
                        <Text style={[styles.tableCell, styles.col4, { textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {order.items.map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        const price = product?.pricingTiers[0]?.price || 0;
                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.col1]}>{product?.name}</Text>
                                <Text style={[styles.tableCell, styles.col2, { textAlign: 'right' }]}>{item.quantity}</Text>
                                <Text style={[styles.tableCell, styles.col3, { textAlign: 'right' }]}>${price.toFixed(2)}</Text>
                                <Text style={[styles.tableCell, styles.col4, { textAlign: 'right' }]}>${(price * item.quantity).toFixed(2)}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax (19%):</Text>
                        <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { fontSize: 16 }]}>Total Due:</Text>
                        <Text style={[styles.totalValue, { fontSize: 16 }]}>${total.toFixed(2)}</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default InvoicePdf;