const kaltura = require('kaltura-client');
const validator = require('validator');

//Init kaltura
const config = new kaltura.Configuration(process.env.KALTURA_PARENT_ID);
config.serviceUrl = 'http://www.kaltura.com';
const client = new kaltura.Client(config);
const pager = new kaltura.objects.FilterPager();
const filter = new kaltura.objects.MediaEntryFilter();

const initFilters = () => {
    pager.pageIndex = 1;
    pager.pageSize = 10;
    filter.nameLike = "";
    filter.orderBy = "+createdAt";
}

const login = async (email, password) => {
    if (!validator.isEmail(email)) {
        throw new Error('Please enter a valid email');
    }

    if (!validator.isLength(password, { min: 6 })) {
        throw new Error('Please enter at least 6 characters');
    }

    try {
        const ks = await kaltura.services.user.loginByLoginId(email, password, process.env.KALTURA_PARENT_ID)
            .execute(client)
            .then(result => {
                return result;
            }, (error) => {
                throw new Error(error.message);
            });
        client.setKs(ks);
        initFilters();
        const mediaData = await getMediaList();

        return mediaData;
    } catch (error) {
        throw new Error(error);
    }
}

const getMediaList = async () => {
    try {
        const mediaList = await kaltura.services.media.listAction(filter, pager)
            .execute(client)
            .then(data => {
                return data;
            });

        return {
            media: mediaList.objects,
            totalCount: mediaList.totalCount
        }
    } catch (error) {
        throw new Error(error.code)
    }
}

const getAllMedia = async () => {
    try {
        initFilters();
        const mediaData = await getMediaList();

        return mediaData;
    } catch (error) {
        throw new Error(error)
    }
}

const filterMedia = async (q, soryByCreationDate, page) => {
    try {
        initFilters();

        if (validator.isBoolean(soryByCreationDate) && soryByCreationDate == "true") {
            filter.orderBy = "-createdAt";
        }

        if (q) {
            filter.nameLike = q;
        }

        if (validator.isInt(page) && page > 0) {
            pager.pageIndex = page
        }

        return await getMediaList();
    } catch (error) {
        throw new Error(error)
    }
}

const deleteMedia = async (id, email) => {
    try {
        initFilters();

        filter.id = id;
        filter.userId = email; // Check if the user is the owner of the file 

        const mediaToDelete = await getMediaList();

        if (mediaToDelete) {
            await kaltura.services.media.deleteAction(id)
                .execute(client)
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    login,
    getAllMedia,
    filterMedia,
    deleteMedia,
};