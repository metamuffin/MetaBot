export interface TranslationModel {
    lang: string
    success_generic: string
    error_generic: string
    error: string
    config: {
        module: {
            success_disabled: string
            success_enabled: string
            error_already_disabled: string
            error_already_enabled: string
            error_module_not_found: string
        }
    }
    misc: {
        help: {
            description: string
            help_description: string
            help_permission: string
            help_subcommands: string
            title_generic: string
            none: string
        }
    }
    core: {
        general: {
            command_not_found: string
            parse_error: {
                title: string
                not_enough_args: string
                float_invalid: string
                int_invalid: string
                member_id_not_an_integer: string
                member_not_found: string
            }
        }
        permission: {
            no_permission: {
                title: string
                description: string
            }
        }
    }
    permission: {
        permission: {
            success: string
            add_success: string
            permission_not_found: string
            remove_success: string
            permission_list: string
        }
    }
    moderator: {
        blacklist: {
            invite_pasted: string
            blacklist_violation: string
        }
    }
    music: {
        no_player_found: string
        play: {
            not_in_a_voicechannel: string
        }
        loop: {
            state_updated_enable: string
            state_updated_disable: string
        }
    }
}