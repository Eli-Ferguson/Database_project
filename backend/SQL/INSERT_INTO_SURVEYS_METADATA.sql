INSERT INTO `surveys_metadata`(
    `author`,
    `title`,
    `description`,
    `start_date`,
    `end_date`,
    `number_of_questions`) VALUES (?,?,?,STR_TO_DATE(?, '%Y, %m, %d'),STR_TO_DATE(?, '%Y, %m, %d'),?);
    