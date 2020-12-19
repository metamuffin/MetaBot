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
            more_help: string
            path_desc: string
            alias: string
            no_description: string
            not_enabled: string
            arguments: string,
            required: string,
            optional: string
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
            },
            types: {
                string: string,
                int: string,
                float: string,
                boolean: string,
                member: string,
                command: string
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
            permission_not_found: string
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
        nothing_playing: string
        only_one_vote: string
        stop: string,
        skipped: string,
        voteskip: string,
        playback_scheduled: string,
        now_playing: string,
        playback_stopped: string,
        queue_empty: string
        play: {
            not_in_a_voicechannel: string
        }
        loop: {
            state_updated_enable: string
            state_updated_disable: string
        },
        queue: {
            nothing_enqueued: string
        }
    }
}
