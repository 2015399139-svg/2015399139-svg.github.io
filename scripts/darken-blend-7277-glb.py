"""压低 GLB 里过亮的白墙贴图/底色，减轻实时预览发白。"""
import bpy
import os

glb = "/Users/zhuchengbin/Downloads/个人网页/public/models/blend-7277.glb"
tmp = "/Users/zhuchengbin/Downloads/个人网页/public/models/_blend-7277-tmp.blend"

# Fresh empty scene, then import glb
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)

def is_bright(col):
    return (0.2126 * col[0] + 0.7152 * col[1] + 0.0722 * col[2]) > 0.72

changed = 0
for mat in bpy.data.materials:
    if not mat.use_nodes or not mat.node_tree:
        continue
    for node in mat.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            base = node.inputs.get("Base Color")
            if base and hasattr(base, "default_value"):
                c = list(base.default_value)
                if is_bright(c):
                    c[0] *= 0.72
                    c[1] *= 0.72
                    c[2] *= 0.72
                    base.default_value = c
                    changed += 1
            # slightly raise roughness on bright materials to kill specular blowouts
            rough = node.inputs.get("Roughness")
            if rough and hasattr(rough, "default_value") and rough.default_value < 0.45:
                rough.default_value = min(0.62, rough.default_value + 0.18)
                changed += 1
        if node.type == "TEX_IMAGE" and node.image:
            img = node.image
            # only scale very bright albedo-looking images
            name = img.name.lower()
            if "normal" in name or "norm" in name or "rough" in name or "metal" in name:
                continue
            try:
                pixels = list(img.pixels)
            except Exception:
                continue
            if not pixels:
                continue
            # sample every 64th pixel for speed
            step = max(4, len(pixels) // 20000 * 4)
            acc = 0.0
            n = 0
            for i in range(0, len(pixels) - 3, step):
                acc += 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]
                n += 1
            avg = acc / max(1, n)
            if avg > 0.62:
                for i in range(0, len(pixels) - 3, 4):
                    pixels[i] *= 0.78
                    pixels[i + 1] *= 0.78
                    pixels[i + 2] *= 0.78
                img.pixels = pixels
                img.update()
                changed += 1

print("CHANGED", changed)

bpy.ops.export_scene.gltf(
    filepath=glb,
    export_format="GLB",
    export_image_format="JPEG",
    export_jpeg_quality=74,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_cameras=False,
    export_lights=False,
    export_apply=True,
)
print("GLB_OK", os.path.getsize(glb))
