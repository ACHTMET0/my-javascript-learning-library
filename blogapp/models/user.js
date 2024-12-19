const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");

const User = sequelize.define("user", {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Ad - Soyad girmeden devam edemezsiniz!"
            },
            isFullName(value) {
                if (value.split("").length < 2) {
                    throw new Error("Lütfen ad ve soyad bilginizi giriniz");
                }
            }
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Bu email daha önce alınmış."
        },
        validate: {
            notEmpty: {
                msg: "Email girmeden devam edemezsiniz!"
            },
            isEmail: {
                msg: "Girdiğiniz yazı tipi email yazı tipiyle uyuşmuyor"
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Parola girmelisiniz!",
            },
            len: {
                args: [5, 10],
                msg: "Parola 5-10 karakter uzunluğunda olmalıdır!"
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, { timestamps: true });

User.afterValidate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;