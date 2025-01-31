import FooterComponent from "@/components/footer";
import NavBar from "@/components/navbar";

export function HomePage() {
    return (
        <>
                <NavBar />
            <h1 className="h3 mb-3 fw-normal">HOME PAGE</h1>
            <FooterComponent />

        </>
    );
}