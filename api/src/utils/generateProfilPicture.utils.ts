import { randomUUID } from "crypto";

function generateProfilPicture(): string {
    return "https://api.dicebear.com/8.x/bottts-neutral/svg?seed="+randomUUID();
}

export default generateProfilPicture;