import Image from "next/image";
import styles from "./page.module.css";

export default function Hotels() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Image
                    className={styles.logo}
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <h3>А вот теперь это Новая страница</h3>
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
