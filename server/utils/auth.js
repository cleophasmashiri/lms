import bcrpt, { hash } from 'bcrypt';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrpt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrpt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
}

export const comparePassword = (password, hashedPassword) => {
    return bcrpt.compare(password, hashedPassword);
};
