export const MenuJson: any[] = [
    {
        label: "Dashboard", iconSrc: "../../assets/images/menu/Dashboard.png", route: "/dashboard",
        urls: ["/dashboard"],
        tabs: []
    },
    {
        label: "Master", iconSrc: "../../assets/images/menu/Master.png", route: "/company",
        urls: ["/company", "/add-company", "/category", "/brand", "/employee", "/role", "/role-permission", "/parameter-types", "/parameter-values", "/discounts", "/form-master"],
        tabs: [
            { label: 'Company', route: '/company', urls: ['/company', '/add-company'] },
            { label: 'Category', route: '/category', urls: ['/category'] },
            { label: 'Brand', route: '/brand', urls: ['/brand'] },
            { label: 'Employee', route: '/employee', urls: ['/employee'] },
            { label: 'Role', route: '/role', urls: ['/role', '/role-permission'] },
            { label: 'Parameter Types', route: '/parameter-types', urls: ['/parameter-types'] },
            { label: 'Parameters Values', route: '/parameter-values', urls: ['/parameter-values'] },
            { label: 'Discounts', route: '/discounts', urls: ['/discounts'] },
            { label: 'Form', route: '/form-master', urls: ['/form-master'] },
        ]
    },
    {
        label: "Outlet", iconSrc: "../../assets/images/menu/Outlet.png", route: "/outlet",
        urls: ["/outlet"],
        tabs: []
    },
    {
        label: "Customer", iconSrc: "../../assets/images/menu/Customer.png", route: "/customer",
        urls: ["/customer"],
        tabs: []
    },
    {
        label: "Product", iconSrc: "../../assets/images/menu/Product.png", route: "/product",
        urls: ["/product", "/product-add", "/product-detail", "/scrap", "/manufacturing", "/manufacturing-items", "/stock-transfer", "/stock-transfer-add", "/attribute-master", "/manufacturing-items-update"],
        tabs: [
            { label: 'Product', route: '/product', urls: ['/product', '/product-add', '/product-detail', '/manufacturing-items'] },
            { label: 'Scrap', route: '/scrap', urls: ['/scrap'] },
            { label: 'Manufacturing Items', route: '/manufacturing', urls: ['/manufacturing', '/manufacturing-items-update'] },
            { label: 'Stock Transfer', route: '/stock-transfer', urls: ['/stock-transfer', '/stock-transfer-add'] },
            { label: 'Attribute Master', route: '/attribute-master', urls: ['/attribute-master'] },
        ]
    },
    {
        label: "Purchase", iconSrc: "../../assets/images/menu/Purchase.png", route: "/purchase-order",
        urls: ["/purchase-order", "/purchase-order-add", "/purchase-inward", "/purchase-inward-add", "/purchase-invoice", "/purchase-invoice-details", "/purchase-invoice-add"],
        tabs: [
            { label: 'Purchase Order', route: '/purchase-order', urls: ['/purchase-order', '/purchase-order-add'] },
            { label: 'Purchase Inward', route: '/purchase-inward', urls: ['/purchase-inward', '/purchase-inward-add'] },
            { label: 'Purchase Invoice', route: '/purchase-invoice', urls: ['/purchase-invoice', '/purchase-invoice-add', '/purchase-invoice-details'] },
        ]
    },
    {
        label: "Pos", iconSrc: "../../assets/images/menu/POS.png", route: "/pos",
        urls: ["/pos"],
        tabs: []
    },
    {
        label: "Sales", iconSrc: "../../assets/images/menu/Sales.png", route: "/sales-estimate",
        urls: ["/sales-order", "/sales-order-add", "/sales-estimate", "/sales-estimate-add", "/sales-invoice", "/sales-invoice-add", "/sales-invoice-details", "/sales-return", "/sales-return-add", "/sales-register", "/sales-register-add", "/sales-register-details", "/pos-credit", "/expense"],
        tabs: [
            { label: 'Sales Estimate', route: '/sales-estimate', urls: ['/sales-estimate', '/sales-estimate-add'] },
            { label: 'Sales Order', route: '/sales-order', urls: ['/sales-order', '/sales-order-add'] },
            { label: 'Sales Invoice', route: '/sales-invoice', urls: ['/sales-invoice', '/sales-invoice-add', '/sales-invoice-details'] },
            { label: 'Sales Return', route: '/sales-return', urls: ['/sales-return', '/sales-return-add'] },
            { label: 'Sales Register', route: '/sales-register', urls: ['/sales-register', '/sales-register-add', '/sales-register-details'] },
            { label: 'POS Credit', route: '/pos-credit', urls: ['/pos-credit'] },
            { label: 'Expense ', route: '/expense', urls: ['/expense'] },
        ]
    },
    {
        label: "Settings", iconSrc: "../../assets/images/menu/Settings.png", route: "/settings-master",
        urls: ["/settings-master", "/email-template"],
        tabs: [
            { label: 'Settings Master', route: '/settings-master', urls: ['/settings-master'] },
            { label: 'Email Template', route: '/email-template', urls: ['/email-template'] },
        ]
    },
    {
        label: "Reports", iconSrc: "../../assets/images/menu/Reports.png", route: "/reports",
        urls: ["/reports"],
        tabs: []
    }
];