import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

(async () => {
    const { default: express } = await import("express");
    const { default: cors } = await import("cors");
    const { default: voterRoutes } = await import("./routes/voter.routes.js");
    const { default: adminRoutes } = await import("./routes/admin.routes.js");

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api/voter", voterRoutes);
    app.use("/api/admin", adminRoutes);

    app.listen(3001, () =>
        console.log("Backend running on http://localhost:3001")
    );
})();
