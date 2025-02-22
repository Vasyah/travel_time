import React, {FC} from 'react'
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TravelButton} from "@/shared/ui/Button/Button";

export interface FormButtonsProps {
    onClose: () => void;
    onAccept: (args?: any) => void;
    isLoading?: boolean;
}


export const FormButtons: FC<FormButtonsProps> = ({
                                                      onAccept,
                                                      onClose,
                                                      isLoading = false,
                                                  }:
                                                  FormButtonsProps
) => {
    return (
        <Grid cols={2}>
            <GridItem>
                <TravelButton
                    style={{color: 'red', borderColor: 'red'}}
                    size="m"
                    view="secondary"
                    label="Отмена"
                    onClick={onClose}
                    disabled={isLoading}

                />
            </GridItem>
            <GridItem style={{alignSelf: 'end'}}>
                <TravelButton
                    size="m"
                    label="Добавить"
                    onClick={onAccept}
                    loading={isLoading}
                /></GridItem>
        </Grid>
    )
}
