/********************************************************************************************
*                                     CAPITALIZE TEXTS                                      *
*********************************************************************************************/
/**
 * Transform text with first word was capitalized
 * @param text original string
 * @returns string with first word capitalized
 */
export const capitalize = (text: string) => (
    text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase()
);

/**
 * Transform text with every word was capitalized
 * @param text original string
 * @returns string full capitalized
 */
export const capitalizeAll = (text: string) => {
    const newText = text.trim().split(' ').map(
        (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase()
    );
    return newText.join(' ');
};
