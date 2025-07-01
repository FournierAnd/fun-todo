
export default function Footer() {

    const date = String(new Date().getFullYear());

    return(
        <div className="flex justify-center items-center p-4 z-0">
            © {date} Andréanne Fournier | All rights reserved
        </div>
    );
}

//Tous droits réservés