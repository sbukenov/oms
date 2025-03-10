export type Customer = {
    id: string;
    reference: string;
    name: string;
    email: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    url: string;
    account: {
        id: string;
        url: string;
    };
};
